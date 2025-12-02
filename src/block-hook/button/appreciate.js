/**
 * WordPress dependencies
 */
import {
	DropZone,
	Button,
	Spinner,
	__experimentalHStack as HStack,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { isBlobURL } from '@wordpress/blob';
import { useSelect } from '@wordpress/data';
import {
	MediaUpload,
	MediaUploadCheck,
	store as blockEditorStore,
	InspectorControls,
} from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { store as blocksStore } from '@wordpress/blocks';

import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

const ALLOWED_MEDIA_TYPES = [ 'image' ];
const DEFAULT_IMAGE_LABEL = __( 'Add image', 'mone' );

export function registerBlockTypeAppreciateButton( settings, name ) {
	if ( name !== 'core/button' ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		moneAppreciateAnimationImageId: {
			type: 'number',
		},
		moneAppreciateAnimationImageUrl: {
			type: 'string',
		},
	};

	return settings;
}

export const BlockEditAppreciateButton = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes, clientId } = props;
		const { getSettings } = useSelect( blockEditorStore );
		if ( name !== 'core/button' ) {
			return <BlockEdit { ...props } />;
		}
		const {
			moneAppreciateAnimationImageId,
			moneAppreciateAnimationImageUrl,
		} = attributes;
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		const { parentCoreGroupIds } = useSelect(
			( select ) => {
				const { getBlockNamesByClientId, getBlockParents } =
					select( blockEditorStore );
				const parentIds = getBlockParents( clientId ) || [];
				const parentCoreGroupClientIds = parentIds.filter(
					( id ) =>
						getBlockNamesByClientId( [ id ] )[ 0 ] === 'core/group'
				);
				return {
					parentCoreGroupIds: parentCoreGroupClientIds,
				};
			},
			[ clientId ]
		);

		if ( ! parentCoreGroupIds ) {
			return <BlockEdit { ...props } />;
		}

		const { parentCoreGroupVariations } = useSelect(
			( select ) => {
				const { getBlockAttributes } = select( blockEditorStore );
				const { getActiveBlockVariation } = select( blocksStore );

				const _parentCoreGroupVariations = parentCoreGroupIds.map(
					( id ) => {
						const _attributes = getBlockAttributes( id );
						return getActiveBlockVariation(
							'core/group',
							_attributes
						);
					}
				);

				return {
					parentCoreGroupVariations: _parentCoreGroupVariations,
				};
			},
			[ parentCoreGroupIds ]
		);

		const isAppreciateButtonGroup = parentCoreGroupVariations.some(
			( variation ) => variation?.name === 'mone/appreciate-button-group'
		);

		if ( ! isAppreciateButtonGroup ) {
			return <BlockEdit { ...props } />;
		}

		const toggleRef = useRef();
		const [ isLoading, setIsLoading ] = useState( false );

		const onUpdateImage = ( value ) => {
			const newOptionObj = {
				moneAppreciateAnimationImageId: value.id,
				moneAppreciateAnimationImageUrl: value.url,
			};
			setAttributes( newOptionObj );
		};
		const onRemoveImage = () => {
			const newOptionObj = {
				moneAppreciateAnimationImageId: null,
				moneAppreciateAnimationImageUrl: null,
			};
			setAttributes( newOptionObj );
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
				<BlockEdit { ...props } />
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Click animation image', 'mone' ) }
						resetAll={ onRemoveImage }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							label={ __( 'Click animation image', 'mone' ) }
							isShownByDefault
							hasValue={ () =>
								!! moneAppreciateAnimationImageUrl
							}
							onDeselect={ onRemoveImage }
						>
							<MediaUploadCheck>
								<MediaUpload
									title={ __( 'Image' ) }
									onSelect={ onUpdateImage }
									allowedTypes={ ALLOWED_MEDIA_TYPES }
									render={ ( { open } ) => (
										<div className="editor-post-featured-image__container">
											<Button
												ref={ toggleRef }
												className={
													! moneAppreciateAnimationImageUrl
														? 'editor-post-featured-image__toggle'
														: 'editor-post-featured-image__preview'
												}
												onClick={ open }
												disabled={ isLoading }
											>
												{ moneAppreciateAnimationImageUrl && (
													<img
														className="editor-post-featured-image__preview-image"
														src={
															moneAppreciateAnimationImageUrl
														}
														alt=""
														style={ {
															aspectRatio: 1,
														} }
													/>
												) }
												{ isLoading && <Spinner /> }
												{ ! moneAppreciateAnimationImageUrl &&
													! isLoading &&
													DEFAULT_IMAGE_LABEL }
											</Button>
											{ !! moneAppreciateAnimationImageUrl && (
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
											<DropZone
												onFilesDrop={ onDropFiles }
											/>
										</div>
									) }
									value={ moneAppreciateAnimationImageId }
								/>
							</MediaUploadCheck>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	}
);

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/appreciate-button',
	registerBlockTypeAppreciateButton
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/appreciate-button',
	BlockEditAppreciateButton
);
