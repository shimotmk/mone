import './style.scss';
import { registerBlockStyle, registerBlockVariation } from '@wordpress/blocks';

registerBlockStyle( 'core/navigation', {
	name: 'mone-navigation',
	label: 'Mone Navigation',
} );

registerBlockVariation( 'core/navigation', {
	name: 'mone/navigation-default',
	attributes: {
		className: 'is-style-mone-navigation',
	},
	isDefault: true,
	scope: [ 'inserter' ],
} );
