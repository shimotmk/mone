import {
	store as blockEditorStore,
	getColorObjectByAttributeValues,
} from '@wordpress/block-editor';
import { select } from '@wordpress/data';

export const colorSlugToColorCode = ( color ) => {
	if ( ! color ) {
		return color;
	}

	const colorSet = select( blockEditorStore ).getSettings().colors;
	const ColorValue = getColorObjectByAttributeValues( colorSet, color );
	return ColorValue.color || color;
};
