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
import './style.scss';
import variations from './variations';

const { name } = metadata;

export { metadata, name };

registerBlockType( name, {
	icon,
	edit,
	variations,
} );
