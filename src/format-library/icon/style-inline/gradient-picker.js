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
import { setAttributes } from './index';

export function GradientColorPicker( { name, value, onChange } ) {
	const colorSettings = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const activeColors = useMemo(
		() => getActiveIcons( value, name, colorSettings, gradientValues ),
		[ name, value, colorSettings, gradientValues ]
	);

	const onColorChange = useCallback(
		( color ) => {
			onChange(
				setAttributes(
					value,
					name,
					colorSettings,
					{ iconGradientColor: color },
					colorGradientSettings.gradients
				)
			);
		},
		[
			onChange,
			value,
			name,
			colorSettings,
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
