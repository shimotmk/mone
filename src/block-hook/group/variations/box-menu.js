/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { boxMenu as Icon } from '../../../icons';

const example = {
	attributes: {
		style: {
			spacing: {
				blockGap: '0.5rem',
			},
		},
		layout: {
			type: 'grid',
			columnCount: 2,
			minimumColumnWidth: null,
		},
		metadata: {
			patternName: 'mone/box-menu-group',
		},
		allowedBlocks: [ 'core/group' ],
	},
	innerBlocks: [
		{
			name: 'core/group',
			attributes: {
				style: {
					layout: {
						columnSpan: 1,
						rowSpan: 1,
					},
					border: {
						width: '1px',
					},
					spacing: {
						padding: {
							top: 'var:preset|spacing|10',
							bottom: 'var:preset|spacing|10',
							left: 'var:preset|spacing|10',
							right: 'var:preset|spacing|10',
						},
						blockGap: '0.5rem',
					},
				},
				borderColor: 'mone-border',
				layout: {
					type: 'constrained',
				},
				href: '#',
				moneHoverBackgroundColor: 'main-bg',
			},
			innerBlocks: [
				{
					name: 'mone/icons',
					attributes: {
						layout: {
							type: 'flex',
							justifyContent: 'center',
						},
					},
					innerBlocks: [
						{
							name: 'mone/icon',
							attributes: {
								iconName: 'FiCheck',
							},
						},
					],
				},
				{
					name: 'core/paragraph',
					attributes: {
						align: 'center',
						style: {
							typography: {
								lineHeight: '1',
							},
						},
						fontSize: 'small',
						placeholder: 'Text',
					},
				},
			],
		},
		{
			name: 'core/group',
			attributes: {
				style: {
					layout: {
						columnSpan: 1,
						rowSpan: 1,
					},
					border: {
						width: '1px',
					},
					spacing: {
						padding: {
							top: 'var:preset|spacing|10',
							bottom: 'var:preset|spacing|10',
							left: 'var:preset|spacing|10',
							right: 'var:preset|spacing|10',
						},
						blockGap: '0.5rem',
					},
				},
				borderColor: 'mone-border',
				layout: {
					type: 'constrained',
				},
				href: '#',
				moneHoverBackgroundColor: 'main-bg',
			},
			innerBlocks: [
				{
					name: 'mone/icons',
					attributes: {
						layout: {
							type: 'flex',
							justifyContent: 'center',
						},
					},
					innerBlocks: [
						{
							name: 'mone/icon',
							attributes: {
								iconName: 'FiCheck',
							},
						},
					],
				},
				{
					name: 'core/paragraph',
					attributes: {
						align: 'center',
						style: {
							typography: {
								lineHeight: '1',
							},
						},
						fontSize: 'small',
						placeholder: 'Text',
					},
				},
			],
		},
		{
			name: 'core/group',
			attributes: {
				style: {
					layout: {
						columnSpan: 1,
						rowSpan: 1,
					},
					border: {
						width: '1px',
					},
					spacing: {
						padding: {
							top: 'var:preset|spacing|10',
							bottom: 'var:preset|spacing|10',
							left: 'var:preset|spacing|10',
							right: 'var:preset|spacing|10',
						},
						blockGap: '0.5rem',
					},
				},
				borderColor: 'mone-border',
				layout: {
					type: 'constrained',
				},
				href: '#',
				moneHoverBackgroundColor: 'main-bg',
			},
			innerBlocks: [
				{
					name: 'mone/icons',
					attributes: {
						layout: {
							type: 'flex',
							justifyContent: 'center',
						},
					},
					innerBlocks: [
						{
							name: 'mone/icon',
							attributes: {
								iconName: 'FiCheck',
							},
						},
					],
				},
				{
					name: 'core/paragraph',
					attributes: {
						align: 'center',
						style: {
							typography: {
								lineHeight: '1',
							},
						},
						fontSize: 'small',
						placeholder: 'Text',
					},
				},
			],
		},
		{
			name: 'core/group',
			attributes: {
				style: {
					layout: {
						columnSpan: 1,
						rowSpan: 1,
					},
					border: {
						width: '1px',
					},
					spacing: {
						padding: {
							top: 'var:preset|spacing|10',
							bottom: 'var:preset|spacing|10',
							left: 'var:preset|spacing|10',
							right: 'var:preset|spacing|10',
						},
						blockGap: '0.5rem',
					},
				},
				borderColor: 'mone-border',
				layout: {
					type: 'constrained',
				},
				href: '#',
				moneHoverBackgroundColor: 'main-bg',
			},
			innerBlocks: [
				{
					name: 'mone/icons',
					attributes: {
						layout: {
							type: 'flex',
							justifyContent: 'center',
						},
					},
					innerBlocks: [
						{
							name: 'mone/icon',
							attributes: {
								iconName: 'FiCheck',
							},
						},
					],
				},
				{
					name: 'core/paragraph',
					attributes: {
						align: 'center',
						style: {
							typography: {
								lineHeight: '1',
							},
						},
						fontSize: 'small',
						placeholder: 'Text',
					},
				},
			],
		},
	],
};

export const boxMenu = {
	name: 'mone/box-menu-group',
	title: __( 'Box Menu', 'mone' ),
	description: __( 'Box Menu', 'mone' ),
	category: 'mone-block-cat',
	icon: Icon,
	scope: [ 'inserter' ],
	isActive: ( blockAttributes ) =>
		blockAttributes?.metadata?.patternName === 'mone/box-menu-group',
	attributes: example.attributes,
	innerBlocks: example.innerBlocks,
	example,
};
