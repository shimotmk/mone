/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	GradientPicker,
	TabPanel,
	Dropdown,
	Button,
	MenuGroup,
	MenuItem,
	__experimentalHStack as HStack,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { moreVertical } from '@wordpress/icons';

export function Color( { activeIcons, onIconChange } ) {
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<>
			<HStack
				style={ {
					padding: '8px 16px',
					borderBottom: '1px solid rgb(221, 221, 221)',
				} }
			>
				<Heading level="4">{ __( 'Icon color', 'mone' ) }</Heading>
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
							<MenuGroup label={ __( 'Icon color', 'mone' ) }>
								<MenuItem
									aria-disabled={
										! activeIcons[ '--the-icon-color' ] &&
										! activeIcons[
											'--the-icon-gradient-color'
										]
									}
									variant="tertiary"
									onClick={ () => {
										onIconChange( {
											'--the-icon-color': undefined,
											'--the-icon-gradient-color':
												undefined,
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
			<TabPanel
				activeClass="is-active"
				tabs={ [
					{
						name: 'color',
						title: __( 'Color' ),
					},
					{
						name: 'gradient',
						title: __( 'Gradient', 'mone' ),
					},
				] }
				initialTabName={
					!! activeIcons[ '--the-icon-gradient-color' ]
						? 'gradient'
						: 'color'
				}
			>
				{ ( tab ) => {
					if ( 'color' === tab.name ) {
						return (
							<div className="mone-popover-color-picker">
								<ColorPalette
									value={ activeIcons[ '--the-icon-color' ] }
									onChange={ ( newValue ) => {
										onIconChange( {
											'--the-icon-color': newValue,
											'--the-icon-gradient-color':
												undefined,
										} );
									} }
									clearable={ false }
									enableAlpha={ true }
								/>
							</div>
						);
					} else if ( 'gradient' === tab.name ) {
						return (
							<div className="mone-popover-color-picker">
								<GradientPicker
									value={
										activeIcons[
											'--the-icon-gradient-color'
										]
									}
									onChange={ ( newValue ) => {
										onIconChange( {
											'--the-icon-color': undefined,
											'--the-icon-gradient-color':
												newValue,
										} );
									} }
									gradients={
										colorGradientSettings.gradients
									}
									clearable={ false }
								/>
							</div>
						);
					}
				} }
			</TabPanel>
		</>
	);
}
