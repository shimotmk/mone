import { getGradientValueBySlug } from '@wordpress/block-editor';
import { select } from '@wordpress/data';

export const gradientSlugToGradientCode = ( color ) => {
	if ( ! color ) {
		return color;
	}

	const gradientSet = select( 'core/block-editor' ).getSettings().gradients;
	return getGradientValueBySlug( gradientSet, color ) || color;
};
