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
	MenuGroup,
	MenuItem,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	Button,
} from '@wordpress/components';
import { moreVertical } from '@wordpress/icons';

export function Background( { activeIcons, onIconChange } ) {
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<>
			<HStack
				style={ {
					padding: '8px 16px',
					borderTop: '1px solid rgb(221, 221, 221)',
					borderBottom: '1px solid rgb(221, 221, 221)',
				} }
			>
				<Heading level="4">{ __( 'Background', 'mone' ) }</Heading>
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
							<MenuGroup label={ __( 'Background', 'mone' ) }>
								<MenuItem
									aria-disabled={
										! activeIcons[ 'background-color' ] &&
										! activeIcons.background
									}
									variant="tertiary"
									onClick={ () => {
										onIconChange( {
											'background-color': undefined,
											background: undefined,
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
					!! activeIcons.background ? 'gradient' : 'color'
				}
			>
				{ ( tab ) => {
					if ( 'color' === tab.name ) {
						return (
							<div className="mone-popover-color-picker">
								<ColorPalette
									value={ activeIcons[ 'background-color' ] }
									onChange={ ( newValue ) => {
										onIconChange( {
											'background-color': newValue,
											background: undefined,
										} );
									} }
									clearable={ false }
									enableAlpha={ true }
									__experimentalIsRenderedInSidebar={ true }
								/>
							</div>
						);
					} else if ( 'gradient' === tab.name ) {
						return (
							<div className="mone-popover-color-picker">
								<GradientPicker
									value={ activeIcons.background }
									onChange={ ( newValue ) => {
										onIconChange( {
											'background-color': undefined,
											background: newValue,
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
