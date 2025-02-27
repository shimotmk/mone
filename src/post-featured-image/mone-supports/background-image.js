import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
	Button,
	__experimentalHStack as HStack,
	Spinner,
} from '@wordpress/components';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { getBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useState, useRef } from '@wordpress/element';
import { isBlobURL } from '@wordpress/blob';

const ALLOWED_MEDIA_TYPES = [ 'image' ];
const DEFAULT_IMAGE_LABEL = __( 'Add a background image', 'mone' );

const hasBackgroundSupport = ( blockNameOrType ) => {
	const moneSupport = getBlockSupport( blockNameOrType, 'moneSatori' );
	const backgroundSupport = moneSupport?.background || false;
	return backgroundSupport && backgroundSupport.backgroundImage === true;
};

export const BlockEditSatori = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;

		if ( ! hasBackgroundSupport( name ) ) {
			return <BlockEdit { ...props } />;
		}

		const [ isLoading, setIsLoading ] = useState( false );
		const toggleRef = useRef();

		const onUpdateImage = ( value ) => {
			setAttributes( {
				moneStyle: {
					...attributes.moneStyle,
					backgroundImageId: value.id,
					backgroundImageUrl: value.url,
				},
			} );
		};

		const onRemoveImage = () => {
			setAttributes( {
				moneStyle: {
					...attributes.moneStyle,
					backgroundImageId: '',
					backgroundImageUrl: '',
				},
			} );
		};

		const onSelect = ( image ) => {
			if ( isBlobURL( image?.url ) ) {
				setIsLoading( true );
				return;
			}
			if ( image ) {
				onUpdateImage( image );
			}
			setIsLoading( false );
		};

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<ToolsPanel label={ __( 'Background Image', 'mone' ) }>
						<ToolsPanelItem
							hasValue={ () =>
								!! attributes.moneStyle?.backgroundImageId ||
								!! attributes.moneStyle?.backgroundImageUrl
							}
							label={ __( 'Background Image', 'mone' ) }
							className="mone-tools-panel-item"
							isShownByDefault={ true }
							onDeselect={ () => onRemoveImage() }
						>
							<MediaUploadCheck>
								<MediaUpload
									title={ __(
										'Set background image',
										'mone'
									) }
									onSelect={ onSelect }
									modalClass="mone-custom-thumbnail-media-modal"
									allowedTypes={ ALLOWED_MEDIA_TYPES }
									render={ ( { open } ) => (
										<div className="editor-post-featured-image__container">
											<Button
												ref={ toggleRef }
												className={
													! attributes.moneStyle
														?.backgroundImageId
														? 'editor-post-featured-image__toggle'
														: 'editor-post-featured-image__preview'
												}
												onClick={ open }
												aria-haspopup="dialog"
												disabled={ isLoading }
											>
												{ attributes.moneStyle
													?.backgroundImageUrl && (
													<img
														className="editor-post-featured-image__preview-image"
														src={
															attributes.moneStyle
																?.backgroundImageUrl
														}
														alt=""
													/>
												) }
												{ isLoading && <Spinner /> }
												{ ! attributes.moneStyle
													?.backgroundImageId &&
													! isLoading &&
													DEFAULT_IMAGE_LABEL }
											</Button>
											{ !! attributes.moneStyle
												?.backgroundImageId && (
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
										</div>
									) }
									value={
										attributes.moneStyle?.backgroundImageId
									}
								/>
							</MediaUploadCheck>
							<p style={ { marginBottom: 0 } }>
								{ __(
									'* Recommended size: 1200px wide, 630px tall',
									'mone'
								) }
							</p>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	}
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/satori/supports-background-image',
	BlockEditSatori
);
