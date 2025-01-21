/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	store as blockEditorStore,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { GradientPicker } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { getActiveIcons } from '../inline';
import { setColors } from './index';

export function GradientColorPicker( { name, property, value, onChange } ) {
	const colors = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const activeColors = useMemo(
		() => getActiveIcons( value, name, colors, gradientValues ),
		[ name, value, colors, gradientValues ]
	);

	const onColorChange = useCallback(
		( color ) => {
			onChange(
				setColors(
					value,
					name,
					colors,
					{ [ property ]: color },
					colorGradientSettings.gradients
				)
			);
		},
		[
			onChange,
			property,
			value,
			name,
			colors,
			colorGradientSettings.gradients,
		]
	);

	return (
		<GradientPicker
			value={ activeColors[ '--the-icon-gradient-color' ] }
			onChange={ onColorChange }
			gradients={ colorGradientSettings.gradients }
		/>
	);
}
