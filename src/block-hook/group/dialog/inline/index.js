/**
 * External dependencies
 */
import { v4 as createId } from 'uuid';

import { __ } from '@wordpress/i18n';
import {
	RichTextToolbarButton,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	store as richTextStore,
	registerFormatType,
	applyFormat,
	slice,
	removeFormat,
} from '@wordpress/rich-text';
import { useDispatch, useRegistry, select } from '@wordpress/data';

import { createDialogBlock } from './constants';
import { Dialog } from '../../../../icons';

const name = 'mone/dialog-trigger';

export const isDialogAnchor = ( block, dialogId ) =>
	!! block.attributes.anchor && block.attributes.anchor === dialogId;

export const computeDialogBlock = ( blocks = [], dialogId ) => {
	let result = [];
	blocks.forEach( ( block = {} ) => {
		if (
			block.name === 'core/group' &&
			isDialogAnchor( block, dialogId )
		) {
			result.push( block );
		} else if ( block.innerBlocks && block.innerBlocks.length > 0 ) {
			result = result.concat(
				computeDialogBlock( block.innerBlocks, dialogId )
			);
		}
	} );
	return result;
};

export const getParagraphClientId = ( blocks = [] ) => {
	return blocks.flatMap( ( block = {} ) => {
		if ( block.name === 'core/paragraph' ) {
			return block.clientId;
		}
		return getParagraphClientId( block.innerBlocks );
	} );
};

export function getDialogId(
	activeAttributes,
	targetAttribute = 'data-dialog-id'
) {
	let dialogId = '';
	if ( activeAttributes[ targetAttribute ] ) {
		dialogId = activeAttributes[ targetAttribute ].startsWith( '#' )
			? activeAttributes[ targetAttribute ].slice( 1 )
			: activeAttributes[ targetAttribute ];
	}
	return dialogId;
}

const InlineEdit = ( props ) => {
	const { value, onChange, activeAttributes, isActive } = props;

	const selectedText = slice( value ).text;

	const registry = useRegistry();
	const { getBlocks, getSelectedBlockClientId, getBlockRootClientId } =
		registry.select( blockEditorStore );
	const { selectBlock, insertBlock, removeBlock } =
		useDispatch( blockEditorStore );

	const dialogBlock = computeDialogBlock(
		getBlocks(),
		getDialogId( activeAttributes )
	);

	function onClick() {
		registry.batch( () => {
			const id = 'dialog-' + createId();
			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						'data-dialog-id': `#${ id }`,
						type: 'button',
						class: 'mone-dialog-inline',
					},
				} )
			);
			const selectedClientId = getSelectedBlockClientId();
			let rootClientId = getBlockRootClientId( selectedClientId );
			while ( rootClientId ) {
				rootClientId = getBlockRootClientId( rootClientId );
			}
			const _dialogBlock = createDialogBlock( id, selectedText );
			insertBlock( _dialogBlock, undefined, rootClientId );

			const paragraphClientIds = getParagraphClientId( [ _dialogBlock ] );
			selectBlock( paragraphClientIds[ 0 ] );
		} );
	}

	function onClickRemove() {
		let newValue = value;
		newValue = removeFormat( newValue, name );
		onChange( { ...newValue } );
	}

	return (
		<>
			<RichTextToolbarButton
				name="moneMenu"
				isActive={ isActive }
				title={
					isActive
						? __( 'Select Dialog', 'mone' )
						: __( 'Set Dialog', 'mone' )
				}
				icon={ Dialog }
				onClick={ () => {
					if ( ! isActive ) {
						onClick();
					} else {
						selectBlock(
							dialogBlock.length > 0 && dialogBlock[ 0 ]?.clientId
						);
					}
				} }
				role="menuitemcheckbox"
			/>
			{ isActive && (
				<RichTextToolbarButton
					name="moneMenu"
					title={ __( 'Delete Dialog', 'mone' ) }
					icon={ Dialog }
					onClick={ () => {
						onClickRemove();
						if ( dialogBlock.length > 0 ) {
							removeBlock( dialogBlock[ 0 ]?.clientId );
						}
					} }
					role="menuitemcheckbox"
				/>
			) }
		</>
	);
};

export const inlineSettings = {
	title: __( 'Dialog', 'mone' ),
	tagName: 'button',
	className: 'mone-dialog-trigger',
	attributes: {
		'data-dialog-id': 'data-dialog-id',
		class: 'class',
		type: 'type',
	},
	edit: InlineEdit,
};

if ( ! select( richTextStore ).getFormatType( name ) ) {
	registerFormatType( name, inlineSettings );
}
