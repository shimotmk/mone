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
import { addCard } from '@wordpress/icons';
import { useDispatch, useRegistry } from '@wordpress/data';

import { default as InlineUI } from './inline';
import { existsClassName } from '../../../../utils-func/class-name';
import { createDialogBlock } from './constants';

const name = 'mone/dialog-link';

const isDialogAnchor = ( block, dialogId ) =>
	!! block.attributes.anchor && block.attributes.anchor === dialogId;

const isEditorOpenClassName = ( block ) =>
	existsClassName( 'mone-edit-show-dialog', block.attributes.className );

const computeOutlineGroup = ( blocks = [], dialogId ) => {
	return blocks.flatMap( ( block = {} ) => {
		if (
			block.name === 'core/group' &&
			isDialogAnchor( block, dialogId ) &&
			isEditorOpenClassName( block )
		) {
			return {
				...block,
			};
		}
		return computeOutlineGroup( block.innerBlocks );
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
	const { value, onChange, contentRef, activeAttributes, isActive } = props;

	const [ isAdding, setIsAdding ] = useState( false );
	const disableIsAdding = useCallback(
		() => setIsAdding( false ),
		[ setIsAdding ]
	);

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

	const _blocks = getBlocks();
	const outlineGroup = computeOutlineGroup( _blocks, dialogId );
	const dialogClientId =
		outlineGroup.length > 0 ? outlineGroup[ 0 ].clientId : null;

	const onSelectParentBlock = useCallback( () => {
		selectBlock( dialogClientId );
	}, [ dialogClientId, selectBlock ] );

	useEffect( () => {
		if ( isActive && dialogClientId && !! activeAttributes?.url ) {
			onSelectParentBlock();
		} else {
			selectBlock( getSelectedBlockClientId() );
		}
	}, [
		isActive,
		onSelectParentBlock,
		dialogClientId,
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
			const dialogBlock = createDialogBlock( id );
			insertBlock( dialogBlock, undefined, rootClientId );

			const paragraphClientIds = getParagraphClientId( [ dialogBlock ] );
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
				icon={ addCard }
				onClick={ () => {
					onClick();
					setIsAdding( true );
				} }
				role="menuitemcheckbox"
			/>
			{ isAdding && (
				<InlineUI
					name={ name }
					onClose={ disableIsAdding }
					activeAttributes={ activeAttributes }
					value={ value }
					onChange={ onChange }
					contentRef={ contentRef }
					setIsAdding={ setIsAdding }
				/>
			) }
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
