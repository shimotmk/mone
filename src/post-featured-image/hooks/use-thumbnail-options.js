import { useDispatch, useSelect } from '@wordpress/data';
import { STORE_NAME } from '../store/constants';

export const useThumbnailOptions = ( selectedThumbnailId ) => {
	return useSelect(
		( select ) => {
			const { getOptions } = select( STORE_NAME );
			const options = getOptions();
			const blockHtml =
				options?.thumbnail_template_variation_lists?.[
					selectedThumbnailId
				]?.blockHtml || null;
			return {
				optionObj: options,
				blockHtml,
			};
		},
		[ selectedThumbnailId ]
	);
};

export const useUpdateThumbnailOptions = ( selectedThumbnailId ) => {
	const { setOptionsStore } = useDispatch( STORE_NAME );

	const { optionObj } = useThumbnailOptions( selectedThumbnailId );

	const updateThumbnailOption = ( newValues ) => {
		const updatedThumbnailList =
			optionObj.thumbnail_template_variation_lists?.map(
				( item, index ) => {
					if ( index === selectedThumbnailId ) {
						return {
							...item,
							...newValues,
						};
					}
					return item;
				}
			);

		const newOptionObj = {
			...optionObj,
			thumbnail_template_variation_lists: updatedThumbnailList,
		};

		setOptionsStore( newOptionObj );
	};

	return updateThumbnailOption;
};
