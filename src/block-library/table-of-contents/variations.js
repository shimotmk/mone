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
		name: 'default-toc',
		title: __( '目次', 'block-library' ),
		attributes: {
			style: {
				border: {
					color: '#6f00ff',
				},
			},
		},
		innerBlocks: [],
		icon: blockCategoryIcon,
		scope: [ 'inserter', 'transform' ],
		isDefault: true,
	},
	{
		name: 'side-toc',
		title: __( '目次(サイド)', 'block-library' ),
		attributes: {
			isLink: true,
			linkTarget: '_blank',
			style: {
				border: {
					color: '#ff0000',
				},
			},
		},
		innerBlocks: [],
		icon: blockCategoryIcon,
		scope: [ isSiteEditor && 'inserter', 'transform' ],
	},
];

export default variations;
