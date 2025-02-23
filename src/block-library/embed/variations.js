/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BlogCard } from '../../icons';

const variations = [
	{
		name: 'default-card',
		title: __( 'Blog card', 'mone' ),
		icon: BlogCard,
		attributes: {
			isLink: true,
			linkTarget: '_blank',
			style: {
				spacing: {
					padding: {
						top: '1rem',
						right: '1rem',
						bottom: '1rem',
						left: '1rem',
					},
				},
				border: {
					color: '#e1e1e1',
					width: '1px',
				},
			},
		},
		innerBlocks: [
			[
				'core/columns',
				{
					isStackedOnMobile: false,
					lock: {
						move: false,
						remove: true,
					},
					style: {
						spacing: {
							blockGap: { top: '1.5rem', left: '1.5rem' },
						},
					},
				},
				[
					[
						'core/column',
						{
							verticalAlignment: 'top',
							width: '25%',
						},
						[
							[
								'mone/embed-featured-image',
								{
									aspectRatio: '1',
								},
								[],
							],
						],
					],
					[
						'core/column',
						{
							lock: {
								move: false,
								remove: true,
							},
							width: '75%',
						},
						[
							[
								'mone/embed-title',
								{
									isLink: true,
									linkTarget: '_blank',
									style: {
										typography: {
											fontStyle: 'normal',
											fontWeight: '600',
										},
									},
								},
								[],
							],
							[
								'mone/embed-excerpt',
								{
									style: {
										elements: {
											link: {
												color: {
													text: 'var:preset|color|content-contrast-2',
												},
											},
										},
										spacing: {
											margin: {
												top: '0',
												bottom: '0',
											},
										},
									},
									textColor: 'content-contrast-2',
									fontSize: 'small',
								},
								[],
							],
						],
					],
				],
			],
		],
		scope: [ 'inserter', 'block' ],
		isDefault: true,
	},
	{
		name: 'top-image-card',
		title: __( 'Top image', 'mone' ),
		icon: BlogCard,
		attributes: {
			isLink: true,
			linkTarget: '_blank',
			style: {
				border: {
					color: '#e1e1e1',
					width: '1px',
				},
			},
		},
		innerBlocks: [
			[
				'mone/embed-featured-image',
				{
					aspectRatio: '1.91/1',
				},
				[],
			],
			[
				'core/group',
				{
					style: {
						spacing: {
							padding: {
								left: '1rem',
								right: '1rem',
								top: '1rem',
								bottom: '1rem',
							},
							margin: {
								top: '0',
								bottom: '0',
							},
						},
					},
				},
				[
					[
						'mone/embed-title',
						{
							isLink: true,
							linkTarget: '_blank',
						},
						[],
					],
					[
						'mone/embed-excerpt',
						{
							style: {
								elements: {
									link: {
										color: {
											text: 'var:preset|color|content-contrast-2',
										},
									},
								},
								spacing: {
									margin: {
										top: '0',
										bottom: '0',
									},
								},
							},
							textColor: 'content-contrast-2',
							fontSize: 'small',
						},
						[],
					],
					[
						'core/group',
						{
							style: {
								spacing: {
									blockGap: '6px',
									margin: { top: '0', bottom: '0' },
								},
							},
							layout: {
								type: 'flex',
								flexWrap: 'nowrap',
								verticalAlignment: 'center',
							},
						},
						[
							[
								'mone/embed-site-logo',
								{
									isLink: true,
									linkTarget: '_blank',
									style: {
										layout: {
											selfStretch: 'fixed',
											flexSize: '15px',
										},
									},
								},
								[],
							],
							[
								'mone/embed-site-title',
								{
									isLink: true,
									linkTarget: '_blank',
									style: {
										elements: {
											link: {
												color: {
													text: 'var:preset|color|content-contrast-2',
												},
											},
										},
									},
									textColor: 'content-contrast-2',
									fontSize: 'small',
								},
								[],
							],
						],
					],
				],
			],
		],
		scope: [ 'block' ],
	},
];

export default variations;
