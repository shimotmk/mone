import { store as coreStore } from '@wordpress/core-data';

import { updateOptions } from './index';
import { createStubPost, KIND, POST_TYPE } from './utils';

export function setOptions( options ) {
	updateOptions( options );
	return {
		type: 'SET_OPTIONS',
		options,
	};
}

export function setOptionsStore( options ) {
	return {
		type: 'SET_OPTIONS',
		options,
	};
}

export function fetchFromAPI( path ) {
	return {
		type: 'FETCH_FROM_API',
		path,
	};
}

/**
 * Persists a stub post with given ID to core data store. The post is meant to be in-memory only and
 * shouldn't be saved via the API.
 *
 * @param {string} id     Post ID.
 * @param {Array}  blocks Blocks the post should consist of.
 * @return {Object} The post object.
 */
export const persistStubPost =
	( id, blocks ) =>
	( { registry } ) => {
		const stubPost = createStubPost( id, blocks );
		registry
			.dispatch( coreStore )
			.receiveEntityRecords(
				KIND,
				POST_TYPE,
				stubPost,
				{ id: stubPost.id },
				false
			);
		return stubPost;
	};
