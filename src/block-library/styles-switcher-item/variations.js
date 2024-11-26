/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { blockCategoryIcon } from '../../icons';

const variationData = {
	current: {
		color: 'key-contrast',
		backgroundColor: 'key',
	},
	default: {
		color: 'key-contrast',
		backgroundColor: 'key',
	},
	white: {
		color: '#5a5b5c',
		backgroundColor: '#FFFFFF',
	},
	green: {
		color: '#fff',
		backgroundColor: '#67adb5',
	},
	blue: {
		color: '#fff',
		backgroundColor: '#375f8c',
	},
	dark: {
		color: '#FFFFFF',
		backgroundColor: '#222222',
	},
};

const variations = Object.keys( variationData ).map( ( name ) => ( {
	name,
	title: sprintf(
		/* translators: %s: switcher item */
		__( '%s switcher item', 'mone' ),
		name.charAt( 0 ).toUpperCase() + name.slice( 1 )
	),
	icon: blockCategoryIcon,
	attributes: {
		styleVariations: name !== 'current' ? name : '',
	},
	scope: [ 'block', 'inserter' ],
	isActive: ( blockAttributes ) => blockAttributes.styleVariations === name,
	innerBlocks: [
		[
			'core/buttons',
			{},
			[
				[
					'core/button',
					{
						text: name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
						tagName: 'button',
						type: 'submit',
						width: 100,
						style: {
							color: {
								text: variationData[ name ].color,
								background:
									variationData[ name ].backgroundColor,
							},
						},
					},
				],
			],
		],
	],
} ) );

export default variations;
