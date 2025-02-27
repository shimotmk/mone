export const buildWidgetAreasPostId = () => `widget-areas`;

export const KIND = 'root';

export const POST_TYPE = 'postType';

/**
 * Creates a stub post with given id and set of blocks. Used as a governing entity records
 * for all widget areas.
 *
 * @param {string} id     Post ID.
 * @param {Array}  blocks The list of blocks.
 * @return {Object} A stub post object formatted in compliance with the data layer.
 */
export const createStubPost = ( id, blocks ) => ( {
	id,
	slug: id,
	status: 'draft',
	type: 'page',
	blocks,
	meta: {
		widgetAreaId: id,
	},
} );

export function buildWidgetsQuery() {
	return {
		per_page: -1,
		_embed: 'about',
	};
}
