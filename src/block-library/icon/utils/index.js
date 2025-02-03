import { renderToString, useEffect } from '@wordpress/element';
import { useDispatch, useSelect, useRegistry } from '@wordpress/data';
import {
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { ReactIcon } from '../../../components/icon-search-popover/ReactIcon';

export function migrateToListV2( attributes ) {
	return {
		...attributes,
	};
}

function useMigrateOnLoad( attributes, clientId ) {
	const registry = useRegistry();
	const { updateBlockAttributes, replaceInnerBlocks } =
		useDispatch( blockEditorStore );

	useEffect( () => {
		// As soon as the block is loaded, migrate it to the new version.

		if ( attributes.iconSVG ) {
			return;
		}

		const [ newAttributes, newInnerBlocks ] = migrateToListV2( attributes );

		registry.batch( () => {
			updateBlockAttributes( clientId, newAttributes );
			replaceInnerBlocks( clientId, newInnerBlocks );
		} );
	}, [ attributes.iconSVG ] );
}
