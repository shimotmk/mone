/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { getPath } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { toc as icon } from '../../icons';

const isSiteEditor = getPath( window.location.href )?.includes(
	'site-editor.php'
);

const variations = [
	{
		name: 'mone-default-toc',
		title: __( 'Table of contents', 'mone' ),
		attributes: {},
		innerBlocks: [],
		icon,
		scope: [ 'inserter' ],
		isDefault: true,
	},
	{
		name: 'side-toc',
		title: __( 'Sidebar Table of Contents', 'mone' ),
		attributes: {
			className: 'mone-is-scroll-animation is-style-mone-default-toc',
		},
		innerBlocks: [],
		icon,
		scope: [ isSiteEditor && 'inserter' ],
	},
];

export default variations;
