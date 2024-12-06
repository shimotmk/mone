/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * block type
 */
import metadata from './block.json';
import edit from './edit';
import './style.scss';
import './editor.scss';

const { name } = metadata;

export { metadata, name };

registerBlockType( name, {
	edit,
} );
