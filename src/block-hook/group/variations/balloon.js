/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { blockCategoryIcon } from '../../../icons';
/* global moneGroupData */

const example = {
	attributes: {
		layout: {
			type: 'flex',
			flexWrap: 'nowrap',
			verticalAlignment: 'top',
			orientation: 'horizontal',
		},
		style: {
			spacing: {
				blockGap: '0.5rem',
			},
		},
		metadata: {
			patternName: 'mone/balloon-group',
			name: __( 'Balloon', 'mone' ),
		},
	},
	innerBlocks: [
		{
			name: 'core/image',
			attributes: {
				lightbox: {
					enabled: false,
				},
				url: `${ moneGroupData.templateUri }/assets/images/user-default.jpg`,
				alt: __( 'Balloon icon', 'mone' ),
				aspectRatio: '1',
				scale: 'cover',
				sizeSlug: 'full',
				linkDestination: 'none',
				style: {
					layout: {
						selfStretch: 'fixed',
						flexSize: '130px',
					},
					border: {
						width: '0px',
						style: 'none',
						radius: '100px',
					},
				},
			},
			innerBlocks: [],
		},
		{
			name: 'core/group',
			attributes: {
				style: {
					layout: {
						selfStretch: 'fixed',
						flexSize: '80%',
					},
				},
				layout: {
					type: 'constrained',
				},
			},
			innerBlocks: [
				{
					name: 'core/paragraph',
					attributes: {
						content: __(
							'Hello, write your sentence here!',
							'mone'
						),
					},
				},
			],
		},
	],
};

export const balloon = {
	name: 'mone/balloon-group',
	title: __( 'Balloon', 'mone' ),
	description: __( 'Balloon', 'mone' ),
	category: 'mone-block-cat',
	attributes: {
		layout: {
			type: 'flex',
			flexWrap: 'nowrap',
			verticalAlignment: 'top',
			orientation: 'horizontal',
		},
		style: {
			spacing: {
				blockGap: '0.5rem',
			},
		},
		metadata: {
			patternName: 'mone/balloon-group',
			name: __( 'Balloon', 'mone' ),
		},
	},
	icon: blockCategoryIcon,
	scope: [ 'inserter' ],
	isActive: ( blockAttributes ) =>
		blockAttributes?.metadata?.patternName === 'mone/balloon-group',
	innerBlocks: [
		[
			'core/image',
			{
				lightbox: {
					enabled: false,
				},
				url: `${ moneGroupData.templateUri }/assets/images/user-default.jpg`,
				alt: __( 'Balloon icon', 'mone' ),
				aspectRatio: '1',
				scale: 'cover',
				sizeSlug: 'full',
				linkDestination: 'none',
				style: {
					layout: {
						selfStretch: 'fixed',
						flexSize: '130px',
					},
					border: {
						width: '0px',
						style: 'none',
						radius: '100px',
					},
				},
			},
			[],
		],
		[
			'core/group',
			{
				style: {
					layout: {
						selfStretch: 'fixed',
						flexSize: '80%',
					},
				},
				layout: {
					type: 'constrained',
				},
			},
			[
				[
					'core/paragraph',
					{
						placeholder: __(
							'Hello, write your sentence here!',
							'mone'
						),
					},
				],
			],
		],
	],
	example,
};
