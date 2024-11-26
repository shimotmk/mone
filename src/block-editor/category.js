import { updateCategory } from '@wordpress/blocks';

import { blockCategoryIcon } from '../icons';

export const moneBlocksCategoryIcon = () => {
	updateCategory( 'mone-block-cat', { icon: blockCategoryIcon } );
};
moneBlocksCategoryIcon();
