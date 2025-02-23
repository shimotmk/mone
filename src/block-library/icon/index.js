/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * block type
 */
import { svgPath as icon } from '../../icons';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import example from './example';
import './style.scss';

const { name } = metadata;

export { metadata, name };

registerBlockType( name, {
	icon,
	edit,
	save,
	deprecated,
	example,
} );
