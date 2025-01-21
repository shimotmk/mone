/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	store as blockEditorStore,
	useSettings,
} from '@wordpress/block-editor';
import {
	FontSizePicker,
	Button,
	__experimentalHStack as HStack,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { getActiveIcons } from '../inline';
import { setAttributes } from './index';

export function Size( { name, value, onChange } ) {
	const colorSettings = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const [ fontSizes ] = useSettings( 'typography.fontSizes' );
	const activeFontSize = useMemo(
		() =>
			getActiveIcons(
				value,
				name,
				colorSettings,
				gradientValues,
				fontSizes
			),
		[ value, name, colorSettings, gradientValues, fontSizes ]
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
								colorSettings,
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
									colorSettings,
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
