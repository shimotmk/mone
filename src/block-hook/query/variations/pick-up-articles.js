/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockVariation } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { moneQuery } from '../../../icons';

registerBlockVariation( 'core/query', {
	name: 'mone/mone-post-in-query',
	title: __( 'Pick Up Articles', 'mone' ),
	description: __( 'Display the selected article.', 'mone' ),
	category: 'mone-block-cat',
	icon: moneQuery,
	isActive: ( { namespace } ) => {
		return namespace === 'mone-post-in-query';
	},
	attributes: {
		query: {
			perPage: 4,
			pages: 0,
			offset: 0,
			postType: 'post',
			orderBy: 'post__in',
			include_posts: [ 1, 2 ],
			multiple_posts: [ 'post', 'page' ],
			exclude: [],
			sticky: 'exclude',
			inherit: false,
		},
		namespace: 'mone-post-in-query',
	},
	allowedControls: [ 'postCount' ],
	innerBlocks: [
		[
			'core/post-template',
			{
				layout: { type: 'grid', columnCount: '2' },
			},
			[
				[
					'core/post-featured-image',
					{
						isLink: true,
						style: {
							border: { width: '1px' },
							spacing: { padding: { top: '0', bottom: '0' } },
						},
						aspectRatio: '1.91/1',
						borderColor: 'mone-border',
					},
				],
				[
					'core/post-title',
					{ level: 5, isLink: true, textAlign: 'center' },
				],
			],
		],
	],
	scope: [ 'inserter', 'transform', 'block' ],
} );
