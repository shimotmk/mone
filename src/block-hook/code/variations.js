/**
 * WordPress dependencies
 */
import { registerBlockVariation } from '@wordpress/blocks';

registerBlockVariation( 'core/code', {
	name: 'mone/code-default',
	attributes: {
		moneLanguageName: 'markup',
	},
	isDefault: true,
	scope: [ 'inserter' ],
} );
