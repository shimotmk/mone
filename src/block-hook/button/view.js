/**
 * WordPress dependencies.
 */
import { store, getContext } from '@wordpress/interactivity';
/* global ClipboardJS */

store(
	'mone/share-button',
	{
		actions: {
			clickCopy() {
				const clipboard = new ClipboardJS( '.mone-copy-button' );
				const context = getContext();

				clipboard.on( 'success', function () {
					context.Copied = true;
					setTimeout( () => {
						context.Copied = false;
					}, 2000 );
				} );
			},

			*navigate( event ) {
				const value = event.target.value;
				if ( !! value ) {
					window.open( value );
				}
			},
		},
	},
	{ lock: true }
);
