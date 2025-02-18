/**
 * External dependencies
 */
import { v4 as createId } from 'uuid';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	RichTextToolbarButton,
	store as blockEditorStore,
	BlockFormatControls,
} from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch, useRegistry } from '@wordpress/data';

import { createDialogBlock } from '../inline/constants';
import {
	getParagraphClientId,
	computeDialogBlock,
	getDialogId,
} from '../inline/index';
import { Dialog } from '../../../../icons';
import { addClass } from '../../../../utils-func/class-name/classAttribute';
import { existsClassName } from '../../../../utils-func/class-name';

export const BlockEditAppreciateButton = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		if ( name !== 'core/button' ) {
			return <BlockEdit { ...props } />;
		}
		const { url, className } = attributes;

		const isActive =
			!! url &&
			url.startsWith( '#dialog-' ) &&
			existsClassName( 'mone-dialog-link', className );

		const registry = useRegistry();
		const { getBlocks, getSelectedBlockClientId, getBlockRootClientId } =
			registry.select( blockEditorStore );
		const { selectBlock, insertBlock } = useDispatch( blockEditorStore );

		const dialogBlock = computeDialogBlock(
			getBlocks(),
			getDialogId( attributes, url )
		);

		function onClick() {
			const id = 'dialog-' + createId();
			setAttributes( {
				url: `#${ id }`,
			} );
			addClass( 'mone-dialog-link', className, setAttributes );
			const selectedClientId = getSelectedBlockClientId();
			let rootClientId = getBlockRootClientId( selectedClientId );
			while ( rootClientId ) {
				rootClientId = getBlockRootClientId( rootClientId );
			}
			const _dialogBlock = createDialogBlock( id );
			insertBlock( _dialogBlock, undefined, rootClientId );

			const paragraphClientIds = getParagraphClientId( [ _dialogBlock ] );
			selectBlock( paragraphClientIds[ 0 ] );
		}

		return (
			<>
				<BlockEdit { ...props } />
				<BlockFormatControls>
					<ToolbarGroup>
						<RichTextToolbarButton
							name="moneMenu"
							className="format-library-text-color-button"
							isActive={ isActive }
							title={ __( 'Dialog', 'mone' ) }
							icon={ Dialog }
							onClick={ () => {
								if ( ! isActive ) {
									onClick();
								} else {
									selectBlock(
										dialogBlock.length > 0 &&
											dialogBlock[ 0 ]?.clientId
									);
								}
							} }
							role="menuitemcheckbox"
						/>
					</ToolbarGroup>
				</BlockFormatControls>
			</>
		);
	}
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/appreciate-button',
	BlockEditAppreciateButton
);
