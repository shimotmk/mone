/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	useCachedTruthy,
	getFontSizeObjectByValue,
	getFontSize,
	__experimentalGetGradientObjectByGradientValue,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	store as blockEditorStore,
	useSettings,
} from '@wordpress/block-editor';
import {
	Popover,
	FontSizePicker,
	Button,
	__experimentalHStack as HStack,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { getActiveIcons } from '../inline';
import { setAttributes } from './index';

export function Size( { name, property, value, onChange } ) {
	const colors = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const [ fontSizes ] = useSettings( 'typography.fontSizes' );
	const activeFontSize = useMemo(
		() => getActiveIcons( value, name, colors, gradientValues, fontSizes ),
		[ value, name, colors, gradientValues, fontSizes ]
	);

	const buttonStyle = {
		marginTop: '16px',
		height: '30px',
	};

	return (
		<>
			<div>
				<FontSizePicker
					fontSizes={ fontSizes }
					value={ activeFontSize.fontSize }
					onChange={ ( newFontSize ) => {
						onChange(
							setAttributes(
								value,
								name,
								colors,
								'',
								colorGradientSettings.gradients,
								fontSizes,
								newFontSize
							)
						);
					} }
					withReset={ false }
				/>
				<HStack alignment="right">
					<Button
						onClick={ () => {
							onChange(
								setAttributes(
									value,
									name,
									colors,
									'',
									colorGradientSettings.gradients,
									fontSizes,
									false
								)
							);
						} }
						variant="secondary"
						style={ buttonStyle }
					>
						{ __( 'Clear' ) }
					</Button>
				</HStack>
			</div>
		</>
	);
}
