/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockVariation } from '@wordpress/blocks';

registerBlockVariation( 'core/separator', {
	name: 'mone/separator-default',
	title: __( 'Separator' ),
	attributes: {
		className: 'mone-separator',
		align: 'center',
		style: {
			border: {
				radius: '1rem',
			},
		},
		moneSeparatorWidth: '100%',
		moneSeparatorHeight: '1px',
	},
	isDefault: true,
	scope: [ 'inserter', 'transform' ],
} );

registerBlockVariation( 'core/separator', {
	name: 'mone/separator-sharp',
	title: __( 'Sharp', 'mone' ),
	attributes: {
		className: 'mone-separator',
		align: 'center',
		style: {
			border: {
				radius: '1rem',
			},
			color: {
				gradient:
					'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgb(48,48,48) 50%,rgba(255,255,255,0) 100%)',
			},
		},
		moneSeparatorWidth: '100%',
		moneSeparatorHeight: '1px',
	},
	scope: [ 'transform' ],
} );
