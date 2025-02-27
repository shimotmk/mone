/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { group as icon } from '@wordpress/icons';

/**
 * block type
 */
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

registerBlockType( name, {
	icon,
	edit,
	save,
} );
