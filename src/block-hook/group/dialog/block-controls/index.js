/**
 * External dependencies
 */
import { v4 as createId } from 'uuid';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	store as blockEditorStore,
	useBlockDisplayInformation,
} from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { useDispatch, useRegistry } from '@wordpress/data';
import { Icon } from '@wordpress/icons';

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

export const useMoneEditControls = ( controlLists, props ) => {
	const { name, attributes, setAttributes, clientId } = props;
	const registry = useRegistry();
	const { selectBlock, insertBlock } = useDispatch( blockEditorStore );
	const blockInformation = useBlockDisplayInformation( clientId );

	if ( ! isAllowedBlock( name ) ) {
		return [ ...controlLists ];
	}

	const targetAttribute = getBlockAttribute( name );
	const { className } = attributes;
	const targetUrl = attributes[ targetAttribute ];

	if (
		existsClassName( 'mone-dialog-content', className ) ||
		existsClassName( 'dialog_input_area', className )
	) {
		return [ ...controlLists ];
	}

	const isActive =
		!! targetUrl &&
		targetUrl.startsWith( '#dialog-' ) &&
		existsClassName( 'mone-dialog-link', className );

	const { getBlocks, getSelectedBlockClientId, getBlockRootClientId } =
		registry.select( blockEditorStore );

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
		const _dialogBlock = createDialogBlock( id, blockInformation?.title );
		insertBlock( _dialogBlock, undefined, rootClientId );

		const paragraphClientIds = getParagraphClientId( [ _dialogBlock ] );
		selectBlock( paragraphClientIds[ 0 ] );
	}

	const newControl = {
		icon: <Icon icon={ Dialog } />,
		title: isActive
			? __( 'Select Dialog', 'mone' )
			: __( 'Set Dialog', 'mone' ),
		isActive,
		onClick() {
			if ( ! isActive ) {
				onClick();
			} else {
				selectBlock(
					dialogBlock.length > 0 && dialogBlock[ 0 ]?.clientId
				);
			}
		},
		role: 'menuitemradio',
	};

	return [ ...controlLists, newControl ];
};

addFilter(
	'mone.BlockToolbarDropdownMenu',
	'mone/additional-controls',
	useMoneEditControls
);
