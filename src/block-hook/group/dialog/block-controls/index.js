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
	BlockControls,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
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

const allowedBlocks = [
	{ 'core/image': 'href' },
	{ 'core/group': 'href' },
	{ 'mone/icon': 'url' },
];
function isAllowedBlock( name ) {
	return allowedBlocks.some( ( block ) => block.hasOwnProperty( name ) );
}

function getBlockAttribute( name ) {
	const block = allowedBlocks.find( ( _block ) =>
		_block.hasOwnProperty( name )
	);
	return block ? block[ name ] : null;
}
export const BlockEditDialogBlock = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		if ( ! isAllowedBlock( name ) ) {
			return <BlockEdit { ...props } />;
		}
		const targetAttribute = getBlockAttribute( name );
		const { className } = attributes;
		const targetUrl = attributes[ targetAttribute ];

		const isActive =
			!! targetUrl &&
			targetUrl.startsWith( '#dialog-' ) &&
			existsClassName( 'mone-dialog-link', className );

		const registry = useRegistry();
		const { getBlocks, getSelectedBlockClientId, getBlockRootClientId } =
			registry.select( blockEditorStore );
		const { selectBlock, insertBlock } = useDispatch( blockEditorStore );

		const dialogBlock = computeDialogBlock(
			getBlocks(),
			getDialogId( attributes, targetAttribute )
		);

		function onClick() {
			const id = 'dialog-' + createId();
			setAttributes( {
				[ targetAttribute ]: `#${ id }`,
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
				{ ! existsClassName( 'mone-dialog-content', className ) &&
					! existsClassName( 'dialog_input_area', className ) && (
						<BlockControls group="block">
							<ToolbarButton
								name="moneMenu"
								icon={ Dialog }
								title={
									isActive
										? __( 'Select Dialog', 'mone' )
										: __( 'Set Dialog', 'mone' )
								}
								isActive={ isActive }
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
							/>
						</BlockControls>
					) }
			</>
		);
	}
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/appreciate-button',
	BlockEditDialogBlock
);
