/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * block type
 */
import { blockCategoryIcon as icon } from '../../icons';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import example from './example';

const { name } = metadata;

export { metadata, name };

registerBlockType( name, {
	icon,
	edit,
	save,
	example,
} );
