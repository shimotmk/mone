/**
 * WordPress dependencies
 */
import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { GradientPicker } from '@wordpress/components';

export function GradientColorPicker( { activeIcons, onIconChange } ) {
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<GradientPicker
			value={ activeIcons[ '--the-icon-gradient-color' ] }
			onChange={ ( newValue ) => {
				onIconChange( { iconGradientColor: newValue } );
			} }
			gradients={ colorGradientSettings.gradients }
		/>
	);
}
