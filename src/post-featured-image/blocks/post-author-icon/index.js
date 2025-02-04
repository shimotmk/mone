/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { commentAuthorAvatar as icon } from '@wordpress/icons';

/**
 * block type
 */
import metadata from './block.json';
import edit from './edit';

const { name } = metadata;

export { metadata, name };

registerBlockType( name, {
	icon,
	edit,
} );
