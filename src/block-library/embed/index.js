/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * block type
 */
import json from './block.json';
import { embedContentIcon } from './icons';
import edit from './edit';
import save from './save';
import example from './example';
import variations from './variations';
import transforms from './transforms';

import './style.scss';

const { name, ...settings } = json;

registerBlockType( name, {
	icon: embedContentIcon,
	...settings,
	example,
	variations,
	transforms,
	edit,
	save,
} );
