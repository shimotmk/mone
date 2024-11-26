/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * block type
 */
import { postExcerpt as icon } from '@wordpress/icons';
import json from './block.json';
import edit from './edit';
import './style.scss';
const { name } = json;

registerBlockType( name, {
	icon,
	edit,
} );
