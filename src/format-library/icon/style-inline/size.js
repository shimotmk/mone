/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useSettings,
	__experimentalSpacingSizesControl as SpacingSizesControl,
	getSpacingPresetCssVar,
} from '@wordpress/block-editor';
import {
	FontSizePicker,
	Button,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';

import { getPresetValueFromCustomValue } from '../../../utils-func/getPresetValueFromCustomValue';
import { getCssVarToWpVar } from '../../../utils-func/cssVar-to-wpVar';

export function Size( { activeIcons, onIconChange } ) {
	const [ fontSizesSettings ] = useSettings( 'typography.fontSizes' );

	const buttonStyle = {
		height: '30px',
	};

	const [ spacingUnits ] = useSettings( 'spacing.units' );
	const availableUnits = spacingUnits
		? spacingUnits.filter( ( unit ) => unit !== '%' )
		: [ 'px', 'em', 'rem', 'vw', 'vh' ];
	const units = useCustomUnits( {
		availableUnits,
		defaultValues: { px: 100, em: 10, rem: 10, vw: 10, vh: 25 },
	} );

	const [ spacingSizes ] = useSettings( 'spacing.spacingSizes' );
	const marginLeft = getPresetValueFromCustomValue(
		getCssVarToWpVar( activeIcons[ 'margin-left' ] ),
		spacingSizes
	);
	const marginRight = getPresetValueFromCustomValue(
		getCssVarToWpVar( activeIcons[ 'margin-right' ] ),
		spacingSizes
	);

	const paddingTop = getPresetValueFromCustomValue(
		getCssVarToWpVar( activeIcons[ 'padding-top' ] ),
		spacingSizes
	);
	const paddingBottom = getPresetValueFromCustomValue(
		getCssVarToWpVar( activeIcons[ 'padding-bottom' ] ),
		spacingSizes
	);
	const paddingLeft = getPresetValueFromCustomValue(
		getCssVarToWpVar( activeIcons[ 'padding-left' ] ),
		spacingSizes
	);
	const paddingRight = getPresetValueFromCustomValue(
		getCssVarToWpVar( activeIcons[ 'padding-right' ] ),
		spacingSizes
	);

	return (
		<>
			<VStack spacing={ 2 }>
				<FontSizePicker
					fontSizes={ fontSizesSettings }
					value={ activeIcons.width }
					onChange={ ( newValue ) => {
						onIconChange( { width: newValue, height: newValue } );
					} }
					withReset={ false }
				/>
				<HStack alignment="right">
					<Button
						onClick={ () => {
							onIconChange( { width: '', height: '' } );
						} }
						variant="tertiary"
						style={ buttonStyle }
					>
						{ __( 'Clear', 'mone' ) }
					</Button>
				</HStack>
				<hr style={ { borderTop: 'none', margin: 0, width: '100%' } } />
				<div style={ { padding: '3px' } }>
					<SpacingSizesControl
						values={ {
							left: marginLeft,
							right: marginRight,
						} }
						onChange={ ( newValue ) => {
							onIconChange( {
								'margin-left': getSpacingPresetCssVar(
									newValue.left
								),
								'margin-right': getSpacingPresetCssVar(
									newValue.right
								),
							} );
						} }
						label={ __( 'Margin', 'mone' ) }
						sides={ [ 'right', 'left' ] }
						units={ units }
						allowReset={ false }
						splitOnAxis={ false }
						showSideInLabel={ false }
					/>
				</div>
				<HStack alignment="right">
					<Button
						onClick={ () => {
							onIconChange( {
								'margin-left': '',
								'margin-right': '',
							} );
						} }
						variant="tertiary"
						style={ buttonStyle }
					>
						{ __( 'Clear', 'mone' ) }
					</Button>
				</HStack>
				<hr style={ { borderTop: 'none', margin: 0, width: '100%' } } />
				<div style={ { padding: '3px' } }>
					<SpacingSizesControl
						values={ {
							top: paddingTop,
							bottom: paddingBottom,
							left: paddingLeft,
							right: paddingRight,
						} }
						onChange={ ( newValue ) => {
							onIconChange( {
								'padding-top': getSpacingPresetCssVar(
									newValue.top
								),
								'padding-left': getSpacingPresetCssVar(
									newValue.left
								),
								'padding-bottom': getSpacingPresetCssVar(
									newValue.bottom
								),
								'padding-right': getSpacingPresetCssVar(
									newValue.right
								),
							} );
						} }
						label={ __( 'Padding', 'mone' ) }
						sides={ [ 'top', 'left', 'bottom', 'right' ] }
						units={ units }
						allowReset={ false }
						splitOnAxis={ false }
						showSideInLabel={ false }
					/>
				</div>
				<HStack alignment="right">
					<Button
						onClick={ () => {
							onIconChange( {
								'padding-top': '',
								'padding-left': '',
								'padding-bottom': '',
								'padding-right': '',
							} );
						} }
						variant="tertiary"
						style={ buttonStyle }
					>
						{ __( 'Clear', 'mone' ) }
					</Button>
				</HStack>
			</VStack>
		</>
	);
}
