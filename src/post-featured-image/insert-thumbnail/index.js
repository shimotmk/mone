import parse from 'html-react-parser';

import { __ } from '@wordpress/i18n';
import { Button, Popover, Spinner } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect, useCallback, Fragment } from '@wordpress/element';
import { debounce, useViewportMatch } from '@wordpress/compose';
import { uploadMedia } from '@wordpress/media-utils';
import { store as noticesStore } from '@wordpress/notices';
import { isBlobURL } from '@wordpress/blob';

import { generateImageList, svgToPngURL, convertImageToBlob } from '../satori';
import { usePostData } from '../hooks/use-post-data';
import { useThemeData } from '../hooks/use-theme-data';
import { useSiteData } from '../hooks/use-site-data';
import { useUserData } from '../hooks/use-user-data';

export const InsertThumbnail = ( props ) => {
	const { uploadImage, postTypeSlug, currentPostId } = props;
	const [ thumbnailSvgList, setThumbnailSvgList ] = useState( null );
	const [ hoveredStyle, setHoveredStyle ] = useState( null );
	const isMobileViewport = useViewportMatch( 'medium', '<' );
	const debouncedSetHoveredStyle = debounce( setHoveredStyle, 250 );
	const [ isInserting, setIsInserting ] = useState( false );

	const { postTitle } = usePostData( postTypeSlug, currentPostId );
	const { colorSet, currentTheme } = useThemeData();
	const { siteLogoMediaItemData, siteTitle, isRequestingSiteLogoData } =
		useSiteData();
	const { myName, myIconUrl, isRequestingMyData } = useUserData();

	const { createErrorNotice, createSuccessNotice } =
		useDispatch( noticesStore );
	const _siteLogoUrl = siteLogoMediaItemData?.source_url ?? false;

	const logErrorOnce = useCallback( () => {
		let hasErrorOccurred = false;
		return ( message ) => {
			if ( ! hasErrorOccurred ) {
				// eslint-disable-next-line no-console
				console.error( message );
				hasErrorOccurred = true;
			}
		};
	}, [] );

	useEffect( () => {
		if ( isRequestingSiteLogoData || isRequestingMyData ) {
			return;
		}
		const fetchImage = async () => {
			try {
				const svgLists = await generateImageList( {
					postTitle,
					siteTitle,
					siteLogoUrl: _siteLogoUrl,
					authorIconUrl: myIconUrl,
					authorName: myName,
					currentTheme: currentTheme.template_uri,
					colorSet,
				} );
				if ( Array.isArray( svgLists ) ) {
					setThumbnailSvgList( svgLists );
				} else {
					// eslint-disable-next-line no-console
					logErrorOnce(
						'Error: The generated image is not a string'
					);
				}
			} catch ( error ) {
				logErrorOnce( 'Error fetching image:' );
			}
		};
		fetchImage();

		return () => {
			debouncedSetHoveredStyle.cancel();
		};
	}, [
		postTitle,
		siteTitle,
		_siteLogoUrl,
		myIconUrl,
		myName,
		isRequestingSiteLogoData,
		isRequestingMyData,
		colorSet,
		debouncedSetHoveredStyle,
		currentTheme.template_uri,
		logErrorOnce,
	] );

	const handleButtonClick = async ( item ) => {
		if ( isInserting ) {
			return;
		}
		setIsInserting( true );
		const pngURL = svgToPngURL( item.svg );
		try {
			const blob = await convertImageToBlob( pngURL );
			uploadMedia( {
				allowedTypes: [ 'image' ],
				filesList: [ new File( [ blob ], 'mone-featured-image.png' ) ],
				additionalData: {
					title: postTitle,
					alt_text: postTitle,
				},
				onFileChange( [ img ] ) {
					if ( isBlobURL( img.url ) ) {
						return;
					}
					uploadImage( img );
					createSuccessNotice(
						__( 'Upload & Eye-Catch Updated', 'mone' ),
						{ type: 'snackbar' }
					);
					setIsInserting( false );
				},
				onError( message ) {
					createErrorNotice( message, { type: 'snackbar' } );
					setIsInserting( false );
				},
			} );
		} catch ( error ) {
			createErrorNotice( error, { type: 'snackbar' } );
			setIsInserting( false );
		}
	};

	const styleItemHandler = useCallback(
		( item ) => {
			if ( hoveredStyle === item ) {
				debouncedSetHoveredStyle.cancel();
				return;
			}
			debouncedSetHoveredStyle( item );
		},
		[ hoveredStyle ]
	);

	return (
		<>
			{ isRequestingSiteLogoData || isRequestingMyData ? (
				<Spinner />
			) : (
				<>
					<div
						className="block-editor-block-styles__variants mone-thumbnail-template-styles"
						onMouseLeave={ () => styleItemHandler( null ) }
					>
						{ thumbnailSvgList?.map( ( item, index ) => (
							<Fragment key={ index }>
								<Button
									className="block-editor-block-styles__item mone-thumbnail-template-media-insert"
									variant="secondary"
									showTooltip={ true }
									key={ item }
									label={ __(
										'Upload & Update Eyecatcher',
										'mone'
									) }
									onClick={ () => handleButtonClick( item ) }
									onMouseEnter={ () =>
										styleItemHandler( item )
									}
									onFocus={ () => styleItemHandler( item ) }
									onMouseLeave={ () =>
										styleItemHandler( null )
									}
									onBlur={ () => styleItemHandler( null ) }
									disabled={ isInserting }
								>
									<div className="svg-wrap">
										{ parse( item.svg ) }
									</div>
									{ isInserting && (
										<div className="mone-svg-media-insert-spinner">
											<Spinner />
										</div>
									) }
								</Button>
							</Fragment>
						) ) }
						{ hoveredStyle && ! isMobileViewport && (
							<Popover
								placement="left-start"
								offset={ 34 }
								focusOnMount={ false }
								className="mone-thumbnail-template-media-insert-popover"
								onMouseLeave={ () => styleItemHandler( null ) }
							>
								<div
									onMouseLeave={ () =>
										styleItemHandler( null )
									}
									style={ { minWidth: '300px' } }
								>
									{ hoveredStyle?.svg !== null && (
										<div className="svg-wrap">
											{ parse( hoveredStyle.svg ) }
										</div>
									) }
								</div>
							</Popover>
						) }
					</div>
				</>
			) }
		</>
	);
};
