/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * block type
 */
import metadata from './block.json';
import { blockCategoryIcon as icon } from '../../icons';
import edit from './edit';
import example from './example';
import './style.scss';
import './editor.scss';

const { name } = metadata;

export { metadata, name };

registerBlockType( name, {
	icon,
	edit,
	example,
} );
