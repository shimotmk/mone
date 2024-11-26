/**
 * WordPress dependencies
 */
import { createReduxStore, register, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { USER_STORE_NAME, USER_API_PATH } from './constants';

export const updateOptions = ( options ) => {
	apiFetch( {
		path: USER_API_PATH,
		method: 'POST',
		data: options,
	} );
};

const DEFAULT_STATE = {
	options: {},
};

/**
 * Store definition for the block-editor namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @type {Object}
 */
const actions = {
	setOptions( options ) {
		// updateOptions( options );
		return {
			type: 'SET_OPTIONS',
			options,
		};
	},

	fetchFromAPI( path ) {
		return {
			type: 'FETCH_FROM_API',
			path,
		};
	},
};

const store = createReduxStore( USER_STORE_NAME, {
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

	selectors: {
		getOptions( state ) {
			const { options } = state;
			return options;
		},
	},

	controls: {
		FETCH_FROM_API( action ) {
			return apiFetch( { path: action.path } );
		},
	},

	resolvers: {
		*getOptions() {
			const path = USER_API_PATH;
			const options = yield actions.fetchFromAPI( path );
			return actions.setOptions( options );
		},
	},
} );

if ( ! select( USER_STORE_NAME ) ) {
	register( store );
}
