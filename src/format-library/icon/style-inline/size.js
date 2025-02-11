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
	Dropdown,
	MenuGroup,
	MenuItem,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { moreVertical } from '@wordpress/icons';

import { getPresetValueFromCustomValue } from '../../../utils-func/getPresetValueFromCustomValue';
import { getCssVarToWpVar } from '../../../utils-func/cssVar-to-wpVar';
import { restButtonStyle } from './index';

export function Size( { activeIcons, onIconChange } ) {
	const [ fontSizesSettings ] = useSettings( 'typography.fontSizes' );

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
			<HStack
				style={ {
					padding: '8px 16px',
					borderTop: '1px solid rgb(221, 221, 221)',
					borderBottom: '1px solid rgb(221, 221, 221)',
				} }
			>
				<Heading level="4">{ __( 'Size', 'mone' ) }</Heading>
				<HStack
					style={ {
						width: 'auto',
						justifyContent: 'right',
						gap: 0,
					} }
				>
					<Button
						onClick={ () => {
							onIconChange( {
								width: undefined,
								height: undefined,
								'margin-left': undefined,
								'margin-right': undefined,
								'padding-top': undefined,
								'padding-left': undefined,
								'padding-bottom': undefined,
								'padding-right': undefined,
							} );
						} }
						variant="tertiary"
						size="small"
						disabled={
							! activeIcons.width &&
							! activeIcons.height &&
							! activeIcons[ 'margin-left' ] &&
							! activeIcons[ 'margin-right' ] &&
							! activeIcons[ 'padding-top' ] &&
							! activeIcons[ 'padding-left' ] &&
							! activeIcons[ 'padding-bottom' ] &&
							! activeIcons[ 'padding-right' ]
						}
						accessibleWhenDisabled
					>
						{ __( 'Clear', 'mone' ) }
					</Button>
					<Dropdown
						popoverProps={ { placement: 'bottom-start' } }
						renderToggle={ ( { isOpen, onToggle } ) => (
							<Button
								onClick={ onToggle }
								aria-expanded={ isOpen }
								icon={ moreVertical }
								size="small"
							/>
						) }
						renderContent={ () => (
							<>
								<MenuGroup label={ __( 'Size', 'mone' ) }>
									<MenuItem
										aria-disabled={
											! activeIcons.width &&
											! activeIcons.height
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												width: undefined,
												height: undefined,
											} );
										} }
									>
										<span className="components-menu-item__item">
											{ __( 'Size', 'mone' ) }
										</span>
										{ activeIcons.width &&
											activeIcons.height && (
												<span style={ restButtonStyle }>
													{ __( 'Reset', 'mone' ) }
												</span>
											) }
									</MenuItem>
									<MenuItem
										aria-disabled={
											! activeIcons[ 'margin-left' ] &&
											! activeIcons[ 'margin-right' ]
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												'margin-left': undefined,
												'margin-right': undefined,
											} );
										} }
									>
										<span className="components-menu-item__item">
											{ __( 'Margin', 'mone' ) }
										</span>
										{ ( activeIcons[ 'margin-left' ] ||
											activeIcons[ 'margin-right' ] ) && (
											<span style={ restButtonStyle }>
												{ __( 'Reset', 'mone' ) }
											</span>
										) }
									</MenuItem>
									<MenuItem
										aria-disabled={
											! activeIcons[ 'padding-top' ] &&
											! activeIcons[ 'padding-left' ] &&
											! activeIcons[ 'padding-bottom' ] &&
											! activeIcons[ 'padding-right' ]
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												'padding-top': undefined,
												'padding-left': undefined,
												'padding-bottom': undefined,
												'padding-right': undefined,
											} );
										} }
									>
										<span className="components-menu-item__item">
											{ __( 'Padding', 'mone' ) }
										</span>
										{ ( activeIcons[ 'padding-top' ] ||
											activeIcons[ 'padding-left' ] ||
											activeIcons[ 'padding-bottom' ] ||
											activeIcons[
												'padding-right'
											] ) && (
											<span style={ restButtonStyle }>
												{ __( 'Reset', 'mone' ) }
											</span>
										) }
									</MenuItem>
									<MenuItem
										aria-disabled={
											! activeIcons.width &&
											! activeIcons.height &&
											! activeIcons[ 'margin-left' ] &&
											! activeIcons[ 'margin-right' ] &&
											! activeIcons[ 'padding-top' ] &&
											! activeIcons[ 'padding-left' ] &&
											! activeIcons[ 'padding-bottom' ] &&
											! activeIcons[ 'padding-right' ]
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												width: undefined,
												height: undefined,
												'margin-left': undefined,
												'margin-right': undefined,
												'padding-top': undefined,
												'padding-left': undefined,
												'padding-bottom': undefined,
												'padding-right': undefined,
											} );
										} }
									>
										{ __( 'Reset all' ) }
									</MenuItem>
								</MenuGroup>
							</>
						) }
					/>
				</HStack>
			</HStack>
			<VStack spacing={ 2 } className="mone-popover-color-picker">
				<FontSizePicker
					fontSizes={ fontSizesSettings }
					value={ activeIcons.width }
					onChange={ ( newValue ) => {
						onIconChange( { width: newValue, height: newValue } );
					} }
					withReset={ false }
				/>
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
			</VStack>
		</>
	);
}
