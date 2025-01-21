/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	store as blockEditorStore,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	useSettings,
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
	const [ fontSizesSettings ] = useSettings( 'typography.fontSizes' );
	const activeIcons = useMemo(
		() =>
			getActiveIcons(
				value,
				name,
				colorSettings,
				gradientValues,
				fontSizesSettings
			),
		[ name, value, colorSettings, gradientValues, fontSizesSettings ]
	);

	const onColorChange = useCallback(
		( color ) => {
			onChange(
				setAttributes(
					value,
					name,
					colorSettings,
					{ iconGradientColor: color },
					colorGradientSettings.gradients,
					fontSizesSettings
				)
			);
		},
		[
			onChange,
			value,
			name,
			colorSettings,
			colorGradientSettings.gradients,
			fontSizesSettings,
		]
	);

	return (
		<GradientPicker
			value={ activeIcons[ '--the-icon-gradient-color' ] }
			onChange={ onColorChange }
			gradients={ colorGradientSettings.gradients }
		/>
	);
}
