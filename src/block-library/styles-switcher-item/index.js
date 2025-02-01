/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * block type
 */
import { toggle as icon } from '../../icons';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import './editor.scss';
import variations from './variations';
import './hooks.js';

const { name } = metadata;

export { metadata, name };

registerBlockType( name, {
	icon,
	edit,
	save,
	variations,
} );
