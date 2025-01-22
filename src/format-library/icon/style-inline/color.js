/**
 * WordPress dependencies
 */
import { ColorPalette } from '@wordpress/block-editor';

export function ColorPicker( { activeIcons, onIconChange } ) {
	return (
		<ColorPalette
			value={ activeIcons[ '--the-icon-color' ] }
			onChange={ ( newValue ) => {
				onIconChange( {
					'--the-icon-color': newValue,
					'--the-icon-gradient-color': undefined,
				} );
			} }
			clearable={ true }
			enableAlpha={ true }
		/>
	);
}
