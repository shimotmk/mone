/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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
import { setAttributes } from './index';

export function Size( { name, value, onChange, activeIcons } ) {
	const colorSettings = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const [ fontSizesSettings ] = useSettings( 'typography.fontSizes' );

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
								newFontSize,
								activeIcons
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
									false,
									activeIcons
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
