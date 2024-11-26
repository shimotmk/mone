/**
 * WordPress dependencies.
 */
import { getContext, store } from '@wordpress/interactivity';
/* global ClipboardJS */

store(
	'mone/code',
	{
		actions: {
			clickCopy() {
				const clipboard = new ClipboardJS( '.mone-copy-button' );
				clipboard.on( 'success', function ( e ) {
					const btn = e.trigger;
					btn.classList.add( 'copied' );
					setTimeout( () => {
						btn.classList.remove( 'copied' );
					}, 4000 );
				} );
			},
			clickWrap() {
				const context = getContext();
				context.isWrap =
					context.isWrap === 'white-space: pre;'
						? 'white-space: pre-wrap; overflow-wrap: anywhere;'
						: 'white-space: pre;';
			},
		},
	},
	{ lock: true }
);
