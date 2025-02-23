/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * block type
 */
import json from './block.json';
import { BlogCard } from '../../icons';
import edit from './edit';
import save from './save';
import example from './example';
import variations from './variations';
import transforms from './transforms';

import './style.scss';

const { name, ...settings } = json;

registerBlockType( name, {
	icon: BlogCard,
	...settings,
	title: __( 'Blog card', 'mone' ),
	description: __(
		'Add a block that fetches and displays content from a URL.',
		'mone'
	),
	example,
	variations,
	transforms,
	edit,
	save,
} );
