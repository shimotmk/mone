/**
 * External dependencies
 */
import { v4 as createId } from 'uuid';

import { __ } from '@wordpress/i18n';
import {
	RichTextToolbarButton,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { registerFormatType, applyFormat } from '@wordpress/rich-text';
import { useState, useCallback, useEffect } from '@wordpress/element';
import { useDispatch, useRegistry } from '@wordpress/data';

import { existsClassName } from '../../../../utils-func/class-name';
import { createDialogBlock } from './constants';
import { Dialog } from '../../../../icons';

const name = 'mone/dialog-link';

const isDialogAnchor = ( block, dialogId ) =>
	!! block.attributes.anchor && block.attributes.anchor === dialogId;

const isEditorOpenClassName = ( block ) =>
	existsClassName( 'mone-edit-show-dialog', block.attributes.className );

const computeDialogBlock = ( blocks = [], dialogId ) => {
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

const getParagraphClientId = ( blocks = [] ) => {
	return blocks.flatMap( ( block = {} ) => {
		if ( block.name === 'core/paragraph' ) {
			return block.clientId;
		}
		return getParagraphClientId( block.innerBlocks );
	} );
};

const InlineEdit = ( props ) => {
	const { value, onChange, activeAttributes, isActive } = props;

	let dialogId = '';
	if ( activeAttributes?.url ) {
		if ( activeAttributes.url.startsWith( '#' ) ) {
			dialogId = activeAttributes.url.slice( 1 );
		} else {
			dialogId = activeAttributes.url;
		}
	}

	const registry = useRegistry();
	const { getBlocks, getSelectedBlockClientId, getBlockRootClientId } =
		registry.select( blockEditorStore );
	const { selectBlock, insertBlock } = useDispatch( blockEditorStore );

	const dialogBlock = computeDialogBlock( getBlocks(), dialogId );

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
				title={ __( 'Dialog', 'mone' ) }
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
		style: 'style',
		class: 'class',
	},
	edit: InlineEdit,
};
registerFormatType( name, inlineSettings );
