/**
 * WordPress dependencies
 */
import { createReduxStore, register, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { STORE_NAME, API_PATH } from './constants';
import * as selectors from './selectors';
import * as actions from './actions';
import * as resolvers from './resolvers';

export const updateOptions = ( options ) => {
	apiFetch( {
		path: API_PATH,
		method: 'POST',
		data: options,
	} );
};

const DEFAULT_STATE = {
	options: {},
};

const store = createReduxStore( STORE_NAME, {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_OPTIONS':
				return {
					...state,
					options: action.options,
				};
		}

		return state;
	},

	actions,

	selectors,

	controls: {
		FETCH_FROM_API( action ) {
			return apiFetch( { path: action.path } );
		},
	},

	resolvers,
} );

if ( ! select( STORE_NAME ) ) {
	register( store );
}
