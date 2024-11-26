/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	DropZone,
	Button,
	Spinner,
	__experimentalHStack as HStack,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';
import { useState, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	MediaUpload,
	MediaUploadCheck,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';

const ALLOWED_MEDIA_TYPES = [ 'image' ];
const DEFAULT_IMAGE_LABEL = __( 'Add NO IMAGE', 'mone' );

export const DefaultImage = () => {
	const toggleRef = useRef();
	const [ isLoading, setIsLoading ] = useState( false );
	const { getSettings } = useSelect( blockEditorStore );

	const { canUserEdit, optionObj, mediaId, mediaSourceUrl } = useSelect(
		( select ) => {
			const { canUser } = select( coreStore );
			const canEdit = canUser( 'update', 'settings' );

			const { getOptions } = select( STORE_NAME );
			return {
				canUserEdit: canEdit,
				optionObj: getOptions(),
				mediaId: getOptions().default_image_id,
				mediaSourceUrl: getOptions().default_image_url,
			};
		},
		[]
	);
	const { setOptions } = useDispatch( STORE_NAME );

	if ( ! canUserEdit ) {
		return null;
	}

	const onUpdateImage = ( value ) => {
		const newOptionObj = {
			...optionObj,
			default_image_id: value.id,
			default_image_url: value.url,
		};
		setOptions( newOptionObj );
	};
	const onRemoveImage = () => {
		const newOptionObj = {
			...optionObj,
			default_image_id: null,
			default_image_url: null,
		};
		setOptions( newOptionObj );
	};

	function onDropFiles( filesList ) {
		getSettings().mediaUpload( {
			allowedTypes: ALLOWED_MEDIA_TYPES,
			filesList,
			onFileChange( [ image ] ) {
				if ( isBlobURL( image?.url ) ) {
					setIsLoading( true );
					return;
				}
				if ( image ) {
					onUpdateImage( image );
				}
				setIsLoading( false );
			},
			onError( message ) {
				// eslint-disable-next-line no-alert,no-undef
				alert( message );
			},
		} );
	}

	return (
		<>
			<Flex direction="column">
				<FlexItem>
					<h3 style={ { margin: '0' } }>
						{ __( 'Default NO IMAGE', 'mone' ) }
					</h3>
				</FlexItem>
				<FlexItem>
					<MediaUploadCheck>
						<MediaUpload
							title={ __( 'NO IMAGE', 'mone' ) }
							onSelect={ onUpdateImage }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							render={ ( { open } ) => (
								<div className="editor-post-featured-image__container">
									<Button
										ref={ toggleRef }
										className={
											! mediaId
												? 'editor-post-featured-image__toggle'
												: 'editor-post-featured-image__preview'
										}
										onClick={ open }
										disabled={ isLoading }
									>
										{ mediaSourceUrl && (
											<img
												className="editor-post-featured-image__preview-image"
												src={ mediaSourceUrl }
												alt=""
											/>
										) }
										{ isLoading && <Spinner /> }
										{ ! mediaId &&
											! isLoading &&
											DEFAULT_IMAGE_LABEL }
									</Button>
									{ !! mediaId && (
										<HStack className="editor-post-featured-image__actions">
											<Button
												className="editor-post-featured-image__action"
												onClick={ open }
												aria-haspopup="dialog"
											>
												{ __( 'Replace' ) }
											</Button>
											<Button
												className="editor-post-featured-image__action"
												onClick={ () => {
													onRemoveImage();
													toggleRef.current.focus();
												} }
											>
												{ __( 'Remove' ) }
											</Button>
										</HStack>
									) }
									<DropZone onFilesDrop={ onDropFiles } />
								</div>
							) }
							value={ mediaId }
						/>
					</MediaUploadCheck>
				</FlexItem>
			</Flex>
		</>
	);
};
