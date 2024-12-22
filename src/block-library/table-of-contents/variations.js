/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { getPath } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { blockCategoryIcon } from '../../icons';

const isSiteEditor = getPath( window.location.href )?.includes(
	'site-editor.php'
);

const variations = [
	{
		name: 'mone-default-toc',
		title: __( 'Table of contents', 'block-library' ),
		attributes: {
			className: 'is-style-mone-default-toc',
		},
		innerBlocks: [],
		icon: blockCategoryIcon,
		scope: [ 'inserter', 'transform' ],
		isDefault: true,
	},
	{
		name: 'side-toc',
		title: __( 'ドット', 'block-library' ),
		attributes: {
			className: 'is-style-mone-side-toc',
		},
		innerBlocks: [],
		icon: blockCategoryIcon,
		scope: [ isSiteEditor && 'inserter', 'transform' ],
	},
];

export default variations;
