/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

/**
 * block type
 */
import { toggle as icon } from '../../icons';
import metadata from './block.json';
import edit from './edit';
import './style.scss';
import './editor.scss';
import './hooks';

const { name } = metadata;

export { metadata, name };

registerBlockType( name, {
	icon,
	edit,
} );

const addToNavigation = ( settings, blockName ) => {
	if ( blockName === 'core/navigation' ) {
		return {
			...settings,
			allowedBlocks: [
				...( settings.allowedBlocks ?? [] ),
				metadata.name,
			],
		};
	}
	return settings;
};
addFilter(
	'blocks.registerBlockType',
	'add-mega-menu-block-to-navigation',
	addToNavigation
);
