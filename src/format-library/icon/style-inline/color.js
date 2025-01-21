/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	ColorPalette,
	store as blockEditorStore,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	useSettings,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getActiveIcons } from '../inline';
import { setAttributes } from './index';

export function ColorPicker( { name, value, onChange } ) {
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
			getActiveIcons( {
				value,
				name,
				colorSettings,
				colorGradientSettings: gradientValues,
				fontSizesSettings,
			} ),
		[ name, value, colorSettings, gradientValues, fontSizesSettings ]
	);

	const onColorChange = useCallback(
		( color ) => {
			onChange(
				setAttributes(
					value,
					name,
					colorSettings,
					{ iconColor: color },
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
			colorGradientSettings,
			fontSizesSettings,
		]
	);

	return (
		<ColorPalette
			value={ activeIcons[ '--the-icon-color' ] }
			onChange={ onColorChange }
			clearable={ true }
			enableAlpha={ true }
		/>
	);
}
