/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';

import { API_PATH } from './constants';
import * as actions from './actions';
import { buildWidgetsQuery } from './utils';
import { transformWidgetToBlock } from './transformers';

export function* getOptions() {
	const options = yield actions.fetchFromAPI( API_PATH );
	return actions.setOptions( options );
}

/**
 * Fetches all widgets from all widgets ares, and groups them by widget area Id.
 *
 * @return {Function} An action creator.
 */
export const getWidgets =
	() =>
	async ( { dispatch, registry } ) => {
		const query = buildWidgetsQuery();
		const widgets = await registry
			.resolveSelect( coreStore )
			.getEntityRecords( 'root', 'widget', query );

		const groupedBySidebar = {};

		for ( const widget of widgets ) {
			const block = transformWidgetToBlock( widget );
			groupedBySidebar[ widget.sidebar ] =
				groupedBySidebar[ widget.sidebar ] || [];
			groupedBySidebar[ widget.sidebar ].push( block );
		}

		for ( const sidebarId in groupedBySidebar ) {
			if ( groupedBySidebar.hasOwnProperty( sidebarId ) ) {
				// Persist the actual post containing the widget block
				dispatch(
					persistStubPost(
						buildWidgetAreaPostId( sidebarId ),
						groupedBySidebar[ sidebarId ]
					)
				);
			}
		}
	};
