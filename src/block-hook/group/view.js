import axios from 'axios';

/**
 * WordPress dependencies.
 */
import { store, getContext } from '@wordpress/interactivity';

import './dialog/view.js';

const { state } = store(
	'mone/click-applause-button',
	{
		state: {
			get count() {
				const context = getContext();
				return state[ context.postId ].count;
			},
		},
		actions: {
			clickApplause() {
				const context = getContext();
				const newCount = parseInt( state.count, 10 ) + 1;
				state[ context.postId ].count = newCount.toString();

				context.isClicked = true;
				setTimeout( () => {
					context.isClicked = false;
				}, 200 );

				context.showCount = true;

				axios
					.post( '/wp-json/mone-user-meta/v1/appreciate', {
						postId: context.postId,
						count: newCount,
					} )
					.then( ( /* response */ ) => {
						// console.log( 'respose', response );
					} )
					.catch( ( error ) => {
						// eslint-disable-next-line no-console
						console.error( 'error', error );
					} );
			},
		},
	},
	{ lock: true }
);
