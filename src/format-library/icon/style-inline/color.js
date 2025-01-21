/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	ColorPalette,
	store as blockEditorStore,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
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
					{ iconColor: color },
					colorGradientSettings.gradients
				)
			);
		},
		[ onChange, value, name, colorSettings, colorGradientSettings ]
	);

	return (
		<ColorPalette
			value={ activeColors[ '--the-icon-color' ] }
			onChange={ onColorChange }
			clearable={ true }
			enableAlpha={ true }
		/>
	);
}
