/**
 * WordPress dependencies
 */
import { Modal, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { listView } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { PatternExplorerSidebar } from './block-variation-explorer';
import Playground from './playground';
import { SaveButton } from './save-button';
import { useThumbnailOptions } from '../hooks/use-thumbnail-options';

export const DEFAULT_VARIATION_ITEM = {
	isCodeEdit: false,
};

export const DEFAULT_VARIATION_STATE = [
	{
		isCodeEdit: false,
	},
];

export const CustomThumbnailModal = ( props ) => {
	const { onModalClose } = props;
	const [ selectedThumbnailId, setSelectedThumbnailId ] = useState( 0 );
	const [ isSidebarOpen, setIsSidebarOpen ] = useState( false );
	const { optionObj } = useThumbnailOptions( selectedThumbnailId );

	// useEffect( () => {
	// 	if (
	// 		! (
	// 			optionObj &&
	// 			optionObj?.thumbnail_template_variation_lists &&
	// 			optionObj.thumbnail_template_variation_lists.length > 0
	// 		)
	// 	) {
	// 		optionObj.thumbnail_template_variation_lists =
	// 			DEFAULT_VARIATION_STATE;
	// 	}
	// }, [ optionObj, selectedThumbnailId ] );

	return (
		<>
			<Modal
				icon={
					<>
						<Button
							className="sidebar-overview-toggle"
							icon={ listView }
							onClick={ () =>
								setIsSidebarOpen( ! isSidebarOpen )
							}
						/>
					</>
				}
				title={ __( 'Custom Thumbnail Templates', 'mone' ) }
				headerActions={
					<>
						<SaveButton
							selectedThumbnailId={ selectedThumbnailId }
						/>
					</>
				}
				onRequestClose={ onModalClose }
				className="mone_custom_thumbnail_modal"
				overlayClassName="mone_custom_thumbnail_modal_overlay"
				isFullScreen
				shouldCloseOnClickOutside={ false }
			>
				<div className="block-editor-block-patterns-explorer">
					{ isSidebarOpen && (
						<PatternExplorerSidebar
							selectedThumbnailId={ selectedThumbnailId }
							onClickCategory={ setSelectedThumbnailId }
						/>
					) }
					<div
						className="block-editor-block-patterns-explorer__list"
						style={ {
							padding: '0',
							margin: isSidebarOpen ? undefined : '0',
						} }
					>
						<Playground
							selectedThumbnailId={ selectedThumbnailId }
							{ ...props }
						/>
					</div>
				</div>
			</Modal>
			<style>
				{ `
                    .mone_custom_thumbnail_modal_overlay + .components-popover__fallback-container {
					position: fixed;
					z-index: 100001;
					.components-popover.block-editor-inserter__popover {
						z-index: 100002;
					}
					}
                ` }
			</style>
		</>
	);
};
