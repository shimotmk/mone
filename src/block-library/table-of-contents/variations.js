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
		title: __( 'Table of contents', 'mone' ),
		attributes: {},
		innerBlocks: [],
		icon: blockCategoryIcon,
		scope: [ 'inserter' ],
		isDefault: true,
	},
	{
		name: 'side-toc',
		title: __( 'Table of Contents (dot)', 'mone' ),
		attributes: {
			maxHeight: '80vh',
			className: 'mone-is-scroll-animation is-style-mone-default-toc',
		},
		innerBlocks: [],
		icon: blockCategoryIcon,
		scope: [ isSiteEditor && 'inserter' ],
	},
];

export default variations;
