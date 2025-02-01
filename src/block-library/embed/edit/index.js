/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	BaseControl,
	Button,
	ToolbarGroup,
	ToolbarButton,
	Spinner,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
	BlockControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { edit } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { View } from '@wordpress/primitives';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import EmbedPlaceholder from './embed-placeholder';
import useRemoteUrlData from '../api/use-rich-url-data';
import fetchUrlData from '../api/fetch-url-data';

export default function EmbedWrapperEdit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const {
		url: attributesUrl,
		isLink,
		rel,
		linkTarget,
		templateLock,
	} = attributes;
	const [ isEditingURL, setIsEditingURL ] = useState( false );
	const [ url, setURL ] = useState( attributesUrl );
	const [ isLoadingClearCache, setIsLoadingClearCache ] = useState( false );
	const [ isStartingBlank, setIsStartingBlank ] = useState( false );
	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlocks( clientId ).length,
		[ clientId ]
	);
	const blockProps = useBlockProps();

	const { richData, isFetching } = useRemoteUrlData(
		attributesUrl,
		isLoadingClearCache
	);

	const onClickClearCache = () => {
		setIsLoadingClearCache( true );
		fetchUrlData( url, { clearCache: true } ).then( () => {
			setIsLoadingClearCache( false );
		} );
	};

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const cannotEmbed = richData === null ? false : richData?.data.cannot_embed;
	const preview = richData === null ? false : ! richData?.data.cannot_embed;

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		prioritizedInserterBlocks: [
			'mone/embed-excerpt',
			'mone/embed-featured-image',
			'mone/embed-site-logo',
			'mone/embed-site-title',
			'mone/embed-title',
		],
		templateLock,
	} );

	// url以外のattributesをundefinedにする
	function setUndefinedExceptSpecifiedProps( obj, propsToKeep ) {
		const newObj = {};
		for ( const key of Object.keys( obj ) ) {
			newObj[ key ] = propsToKeep.includes( key )
				? obj[ key ]
				: undefined;
		}
		return newObj;
	}
	const propertiesToKeep = [ 'url', 'templateLock' ];
	const replaceAttributes = setUndefinedExceptSpecifiedProps(
		attributes,
		propertiesToKeep
	);

	return (
		<>
			<BlockControls>
				{ preview && ! cannotEmbed && ! isEditingURL && (
					<ToolbarGroup>
						<ToolbarButton
							className="components-toolbar__control"
							label={ __( 'Edit URL' ) }
							icon={ edit }
							onClick={ () => setIsEditingURL( true ) }
						/>
					</ToolbarGroup>
				) }
				{ hasInnerBlocks && (
					<ToolbarGroup className="wp-block-template-part__block-control-group">
						<ToolbarButton
							onClick={ () => {
								setAttributes( { ...replaceAttributes } );
								// innerBlocksを削除する
								replaceInnerBlocks( clientId, [] );
								setIsStartingBlank( true );
								setIsEditingURL( false );
							} }
						>
							{ __( 'Replace' ) }
						</ToolbarButton>
					</ToolbarGroup>
				) }
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<BaseControl __nextHasNoMarginBottom>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Link to page', 'mone' ) }
							onChange={ () =>
								setAttributes( { isLink: ! isLink } )
							}
							checked={ isLink }
						/>
						{ isLink && (
							<>
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __( 'Open in new tab' ) }
									onChange={ ( value ) =>
										setAttributes( {
											linkTarget: value
												? '_blank'
												: '_self',
										} )
									}
									checked={ linkTarget === '_blank' }
								/>
								<TextControl
									__nextHasNoMarginBottom
									label={ __( 'Link rel' ) }
									value={ rel }
									onChange={ ( newRel ) =>
										setAttributes( { rel: newRel } )
									}
								/>
							</>
						) }
						{ richData?.data.post_id === undefined && (
							<>
								<Button
									onClick={ onClickClearCache }
									variant="primary"
									isBusy={ isLoadingClearCache }
									disabled={
										!!! attributesUrl ? true : false
									}
								>
									{ __( 'Clear cache', 'mone' ) }
								</Button>
								<p style={ { marginTop: '8px' } }>
									{ __(
										'If the data is old, please clear the cache. It is usually updated every hour.',
										'mone'
									) }
								</p>
							</>
						) }
					</BaseControl>
				</PanelBody>
			</InspectorControls>
			{ ( () => {
				if ( isFetching || isLoadingClearCache ) {
					return (
						<View { ...blockProps }>
							<div className="wp-block-embed is-loading">
								<Spinner />
							</div>
						</View>
					);
				} else if (
					url &&
					attributesUrl &&
					hasInnerBlocks &&
					! isEditingURL &&
					! richData?.data.cannot_embed
				) {
					return <div { ...innerBlocksProps } />;
				}
				return (
					<EmbedPlaceholder
						isStartingBlank={ isStartingBlank }
						setIsStartingBlank={ setIsStartingBlank }
						isEditingURL={ isEditingURL }
						setIsEditingURL={ setIsEditingURL }
						cannotEmbed={ cannotEmbed }
						url={ url }
						setURL={ setURL }
						onClickClearCache={ onClickClearCache }
						{ ...props }
					/>
				);
			} )() }
		</>
	);
}
