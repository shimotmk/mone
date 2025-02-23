/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockVariation } from '@wordpress/blocks';
import { getPath } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { moneQuery as icon } from '../../../icons';
import './pick-up-articles';

const isSiteEditor = getPath( window.location.href )?.includes(
	'site-editor.php'
);

const getInnerBlocksTemplate = ( props ) => {
	const { headingAttribute = {}, templateAttribute = {} } = props;
	return [
		[
			'core/heading',
			{
				...headingAttribute,
			},
			[],
		],
		[
			'core/post-template',
			{
				...templateAttribute,
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
				[ 'core/post-title', { level: 5, isLink: true } ],
			],
		],
		[
			'core/query-pagination',
			{
				paginationArrow: 'chevron',
				showLabel: false,
				layout: {
					type: 'flex',
					justifyContent: 'center',
					orientation: 'horizontal',
					flexWrap: 'nowrap',
				},
				className: 'is-style-mone-query-pagination',
			},
			[
				[ 'core/query-pagination-previous' ],
				[ 'core/query-pagination-numbers', { fontSize: 'medium' } ],
				[ 'core/query-pagination-next' ],
			],
		],
		[
			'core/query-no-results',
			{
				align: 'wide',
			},
			[
				[
					'core/group',
					{
						style: {
							border: { width: '1px' },
						},
						borderColor: 'mone-border',
					},
					[
						[
							'core/paragraph',
							{
								content: __( 'No results found', 'mone' ),
								align: 'center',
								placeholder: __(
									'Please add text or a block to display when the query returns no results.',
									'mone'
								),
							},
						],
					],
				],
			],
		],
	];
};

registerBlockVariation( 'core/query', {
	name: 'mone/popular-query-loop',
	title: __( 'Most Read Articles', 'mone' ),
	description: __( 'Shows the most read articles', 'mone' ),
	category: 'mone-block-cat',
	icon,
	isActive: ( { namespace, query } ) => {
		return (
			namespace === 'mone-popular-query-loop' &&
			query?.meta_query?.queries?.some(
				( _query ) => _query.meta_key === 'mone_post_views_count'
			)
		);
	},
	attributes: {
		// queryId: 0,
		query: {
			perPage: 4,
			pages: 0,
			offset: 0,
			postType: 'post',
			order: 'desc',
			orderBy: 'meta_value_num',
			author: '',
			search: '',
			exclude: [],
			sticky: 'exclude',
			inherit: false,
			meta_query: {
				queries: [
					{
						id: '001',
						meta_key: 'mone_post_views_count',
						meta_value: '',
						meta_compare: '',
					},
				],
			},
			moneQueryType: 'popular-query-loop',
		},
		namespace: 'mone-popular-query-loop',
		enhancedPagination: true,
	},
	allowedControls: [ 'postCount' ],
	innerBlocks: getInnerBlocksTemplate( {
		headingAttribute: {
			textAlign: 'center',
			level: 4,
			content: __( 'Most Read Articles', 'mone' ),
		},
	} ),
	scope: [ isSiteEditor && 'inserter', 'transform', 'block' ],
} );

registerBlockVariation( 'core/query', {
	name: 'mone/related-query-loop',
	title: __( 'Related articles', 'mone' ),
	description: __(
		'Displays random articles from the same category as the post.',
		'mone'
	),
	category: 'mone-block-cat',
	icon,
	isActive: ( { namespace } ) => {
		return namespace === 'mone-related-query-loop';
	},
	attributes: {
		// queryId: 0,
		query: {
			perPage: 4,
			pages: 0,
			offset: 0,
			postType: 'post',
			order: 'desc',
			orderBy: 'rand',
			author: '',
			search: '',
			exclude: [],
			sticky: 'exclude',
			inherit: false,
			taxQuery: {
				category: [],
			},
			moneQueryType: 'related-query-loop',
		},
		namespace: 'mone-related-query-loop',
		enhancedPagination: true,
	},
	allowedControls: [ 'postCount' ],
	innerBlocks: getInnerBlocksTemplate( {
		headingAttribute: {
			level: 4,
			content: __( 'Related articles', 'mone' ),
		},
		templateAttribute: { layout: { type: 'grid', columnCount: '2' } },
	} ),
	scope: [ isSiteEditor && 'inserter', 'transform', 'block' ],
} );
