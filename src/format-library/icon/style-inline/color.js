/**
 * WordPress dependencies
 */
import { ColorPalette } from '@wordpress/block-editor';

export function ColorPicker( { activeIcons, onIconChange } ) {
	return (
		<ColorPalette
			value={ activeIcons[ '--the-icon-color' ] }
			onChange={ ( newValue ) => {
				onIconChange( { iconColor: newValue } );
			} }
			clearable={ true }
			enableAlpha={ true }
		/>
	);
}
