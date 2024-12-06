/**
 * WordPress dependencies
 */
import { createRegistrySelector } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

export const getOptions = ( state ) => {
	const { options } = state;
	return options;
};

/**
 * Given a child client id, returns the parent widget area block.
 *
 * @param {string} clientId The client id of a block in a widget area.
 *
 * @return {WPBlock} The widget area block.
 */
export const getParentWidgetAreaBlock = createRegistrySelector(
	( select ) => ( state, clientId ) => {
		const { getBlock, getBlockName, getBlockParents } =
			select( blockEditorStore );
		const blockParents = getBlockParents( clientId );
		const widgetAreaClientId = blockParents.find(
			( parentClientId ) =>
				getBlockName( parentClientId ) === 'core/widget-area'
		);
		return getBlock( widgetAreaClientId );
	}
);
