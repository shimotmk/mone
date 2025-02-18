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
} from '@wordpress/rich-text';
import { useEffect } from '@wordpress/element';
import { useDispatch, useRegistry, select } from '@wordpress/data';

import { existsClassName } from '../../../../utils-func/class-name';
import { createDialogBlock } from './constants';
import { Dialog } from '../../../../icons';

const name = 'mone/dialog-link';

export const isDialogAnchor = ( block, dialogId ) =>
	!! block.attributes.anchor && block.attributes.anchor === dialogId;

export const isEditorOpenClassName = ( block ) =>
	existsClassName( 'mone-edit-show-dialog', block.attributes.className );

export const computeDialogBlock = ( blocks = [], dialogId ) => {
	return blocks.flatMap( ( block = {} ) => {
		if (
			block.name === 'core/group' &&
			isDialogAnchor( block, dialogId )
		) {
			return {
				...block,
			};
		}
		return computeDialogBlock( block.innerBlocks );
	} );
};

export const getParagraphClientId = ( blocks = [] ) => {
	return blocks.flatMap( ( block = {} ) => {
		if ( block.name === 'core/paragraph' ) {
			return block.clientId;
		}
		return getParagraphClientId( block.innerBlocks );
	} );
};

export function getDialogId( activeAttributes, targetAttribute = 'url' ) {
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

	const registry = useRegistry();
	const { getBlocks, getSelectedBlockClientId, getBlockRootClientId } =
		registry.select( blockEditorStore );
	const { selectBlock, insertBlock } = useDispatch( blockEditorStore );

	const dialogBlock = computeDialogBlock(
		getBlocks(),
		getDialogId( activeAttributes )
	);

	useEffect( () => {
		const dialogClientId =
			dialogBlock.length > 0 && isEditorOpenClassName( dialogBlock[ 0 ] )
				? dialogBlock[ 0 ].clientId
				: null;
		if ( isActive && dialogClientId && !! activeAttributes?.url ) {
			selectBlock( dialogClientId );
		} else {
			selectBlock( getSelectedBlockClientId() );
		}
	}, [
		dialogBlock,
		isActive,
		activeAttributes?.url,
		selectBlock,
		getSelectedBlockClientId,
	] );

	function onClick() {
		registry.batch( () => {
			const id = 'dialog-' + createId();
			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						url: `#${ id }`,
					},
				} )
			);
			const selectedClientId = getSelectedBlockClientId();
			let rootClientId = getBlockRootClientId( selectedClientId );
			while ( rootClientId ) {
				rootClientId = getBlockRootClientId( rootClientId );
			}
			const _dialogBlock = createDialogBlock( id );
			insertBlock( _dialogBlock, undefined, rootClientId );

			const paragraphClientIds = getParagraphClientId( [ _dialogBlock ] );
			selectBlock( paragraphClientIds[ 0 ] );
		} );
	}

	return (
		<>
			<RichTextToolbarButton
				name="moneMenu"
				className="format-library-text-color-button"
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
		</>
	);
};

export const inlineSettings = {
	title: __( 'Dialog', 'mone' ),
	tagName: 'a',
	className: 'mone-dialog-link',
	attributes: {
		url: 'href',
		class: 'class',
	},
	edit: InlineEdit,
};

if ( ! select( richTextStore ).getFormatType( name ) ) {
	registerFormatType( name, inlineSettings );
}
