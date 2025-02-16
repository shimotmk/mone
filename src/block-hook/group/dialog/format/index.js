import { __ } from '@wordpress/i18n';
import {
	RichTextToolbarButton,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { registerFormatType } from '@wordpress/rich-text';
import { useState, useCallback, useMemo, useEffect } from '@wordpress/element';
import { addCard } from '@wordpress/icons';
import { useSelect, useDispatch, useRegistry } from '@wordpress/data';

import { default as InlineUI } from './inline';

const name = 'mone/dialog-link';

const isDialogAnchor = ( block, dialogId ) =>
	!! block.attributes.anchor && block.attributes.anchor === dialogId;

const computeOutlineGroup = ( blocks = [], dialogId ) => {
	return blocks.flatMap( ( block = {} ) => {
		if (
			block.name === 'core/group' &&
			isDialogAnchor( block, dialogId )
		) {
			return {
				...block,
			};
		}
		return computeOutlineGroup( block.innerBlocks );
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
	const { getBlocks } = registry.select( blockEditorStore );

	const blocks = getBlocks();
	const outlineGroup = computeOutlineGroup( blocks, dialogId );
	const dialogClientId =
		outlineGroup.length > 0 ? outlineGroup[ 0 ].clientId : null;

	const { selectBlock } = useDispatch( blockEditorStore );
	const onSelectParentBlock = useCallback( () => {
		selectBlock( dialogClientId );
	}, [ dialogClientId, selectBlock ] );

	useEffect( () => {
		if ( isActive ) {
			onSelectParentBlock();
		}
	}, [ isActive, onSelectParentBlock ] );

	return (
		<>
			<RichTextToolbarButton
				name="moneMenu"
				className="format-library-text-color-button"
				isActive={ isActive }
				title={ __( 'Dialog', 'mone' ) }
				icon={ addCard }
				onClick={ () => {
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
