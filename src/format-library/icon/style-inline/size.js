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
		[ value, name, colorSettings, gradientValues, fontSizesSettings ]
	);

	const buttonStyle = {
		marginTop: '16px',
		height: '30px',
	};

	return (
		<>
			<div>
				<FontSizePicker
					fontSizes={ fontSizesSettings }
					value={ activeIcons.fontSize }
					onChange={ ( newFontSize ) => {
						onChange(
							setAttributes(
								value,
								name,
								colorSettings,
								'',
								colorGradientSettings.gradients,
								fontSizesSettings,
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
									fontSizesSettings,
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
