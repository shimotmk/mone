import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export const usePostData = ( postTypeSlug, currentPostId ) => {
	return useSelect(
		( select ) => {
			const { getEditedEntityRecord } = select( coreStore );
			const _record = getEditedEntityRecord(
				'postType',
				postTypeSlug,
				currentPostId
			);
			return {
				postTitle: _record?.title,
			};
		},
		[ currentPostId, postTypeSlug ]
	);
};
