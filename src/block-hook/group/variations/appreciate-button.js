/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { getPath } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { blockCategoryIcon } from '../../../icons';
/* global moneGroupData */

const isSiteEditor = getPath( window.location.href )?.includes(
	'site-editor.php'
);

const example = {
	attributes: {
		layout: {
			type: 'constrained',
		},
		style: {
			spacing: {
				blockGap: '0.25rem',
			},
			elements: {
				link: {
					color: {
						text: 'var:preset|color|content-contrast-2',
					},
				},
			},
		},
		textColor: 'content-contrast-2',
		moneIsApplause: true,
	},
	innerBlocks: [
		{
			name: 'core/buttons',
			attributes: {
				layout: {
					type: 'flex',
					justifyContent: 'center',
				},
			},
			innerBlocks: [
				{
					name: 'core/button',
					attributes: {
						tagName: 'button',
						className: 'is-style-outline',
						style: {
							border: {
								radius: '100px',
							},
							spacing: {
								padding: {
									left: 'var:preset|spacing|10',
									right: 'var:preset|spacing|10',
									top: 'var:preset|spacing|10',
									bottom: 'var:preset|spacing|10',
								},
							},
							shadow: 'none',
							typography: {
								lineHeight: '1',
							},
						},
						borderColor: 'mone-border',
						moneAppreciateAnimationImageUrl: `${ moneGroupData.templateUri }/assets/images/hand-effect.png`,
						text: `<img style="width: 50px;" src="${
							moneGroupData.templateUri
						}/assets/images/hand.png" alt="${ __(
							'Hand',
							'mone'
						) }">`,
					},
				},
			],
		},
		{
			name: 'core/paragraph',
			attributes: {
				align: 'center',
				className: 'mone_appreciate_count',
				content: '39',
			},
		},
	],
};

export const appreciateGroup = {
	name: 'mone/appreciate-button-group',
	title: __( 'Applause Button', 'mone' ),
	description: __(
		'Applause button and counter that can be pressed multiple times without logging in',
		'mone'
	),
	category: 'mone-block-cat',
	attributes: {
		layout: {
			type: 'constrained',
		},
		style: {
			spacing: {
				blockGap: '0.25rem',
			},
			elements: {
				link: {
					color: {
						text: 'var:preset|color|content-contrast-2',
					},
				},
			},
		},
		textColor: 'content-contrast-2',
		moneIsApplause: true,
	},
	icon: blockCategoryIcon,
	scope: [ isSiteEditor && 'inserter' ],
	isActive: ( blockAttributes ) => blockAttributes?.moneIsApplause,
	innerBlocks: [
		[
			'core/buttons',
			{
				layout: {
					type: 'flex',
					justifyContent: 'center',
				},
			},
			[
				[
					'core/button',
					{
						tagName: 'button',
						className: 'is-style-outline',
						style: {
							border: {
								radius: '100px',
							},
							spacing: {
								padding: {
									left: 'var:preset|spacing|10',
									right: 'var:preset|spacing|10',
									top: 'var:preset|spacing|10',
									bottom: 'var:preset|spacing|10',
								},
							},
							shadow: 'none',
							typography: {
								lineHeight: '1',
							},
						},
						borderColor: 'mone-border',
						moneAppreciateAnimationImageUrl: `${ moneGroupData.templateUri }/assets/images/hand-effect.png`,
						text: `<img style="width: 50px;" src="${
							moneGroupData.templateUri
						}/assets/images/hand.png" alt="${ __(
							'Hand',
							'mone'
						) }">`,
					},
				],
			],
		],
		[
			'core/paragraph',
			{
				align: 'center',
				className: 'mone_appreciate_count',
				metadata: {
					bindings: {
						content: {
							source: 'core/post-meta',
							args: {
								key: 'mone_appreciate_count',
							},
						},
					},
				},
			},
		],
	],
	example,
};
