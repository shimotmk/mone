import { __ } from '@wordpress/i18n';

export const template = [
	[
		'mone/styles-switcher-item',
		{},
		[
			[
				'core/buttons',
				{},
				[
					[
						'core/button',
						{
							text: __( 'Defaults', 'mone' ),
							tagName: 'button',
							type: 'submit',
							width: 100,
							textColor: 'key-contrast',
							backgroundColor: 'key',
						},
					],
				],
			],
		],
	],
	[
		'mone/styles-switcher-item',
		{
			styleVariations: 'white',
		},
		[
			[
				'core/buttons',
				{},
				[
					[
						'core/button',
						{
							text: __( 'white', 'mone' ),
							tagName: 'button',
							type: 'submit',
							width: 100,
							style: {
								color: {
									text: '#5a5b5c',
									background: '#fffffffc',
								},
							},
						},
					],
				],
			],
		],
	],
];
