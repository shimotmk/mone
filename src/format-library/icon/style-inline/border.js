/**
 * WordPress dependencies
 */
import { ColorPalette } from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	Button,
	Dropdown,
	MenuGroup,
	MenuItem,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import {
	lineDashed,
	lineDotted,
	lineSolid,
	moreVertical,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { restButtonStyle } from './index';

const BORDER_STYLES = [
	{ label: __( 'Solid' ), icon: lineSolid, value: 'solid' },
	{ label: __( 'Dashed' ), icon: lineDashed, value: 'dashed' },
	{ label: __( 'Dotted' ), icon: lineDotted, value: 'dotted' },
];

export function Border( { activeIcons, onIconChange } ) {
	return (
		<>
			<HStack
				style={ {
					padding: '8px 16px',
					borderTop: '1px solid rgb(221, 221, 221)',
					borderBottom: '1px solid rgb(221, 221, 221)',
				} }
			>
				<Heading level="4">{ __( 'Border', 'mone' ) }</Heading>
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
								'border-color': undefined,
								'border-style': undefined,
								'border-width': undefined,
								'border-radius': undefined,
							} );
						} }
						variant="tertiary"
						size="small"
						disabled={
							! activeIcons[ 'border-color' ] &&
							! activeIcons[ 'border-style' ] &&
							! activeIcons[ 'border-width' ] &&
							! activeIcons[ 'border-radius' ]
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
								<MenuGroup label={ __( 'Border', 'mone' ) }>
									<MenuItem
										aria-disabled={
											! activeIcons[ 'border-color' ]
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												'border-color': undefined,
											} );
										} }
									>
										<span className="components-menu-item__item">
											{ __( 'Border color', 'mone' ) }
										</span>
										{ activeIcons[ 'border-color' ] && (
											<span style={ restButtonStyle }>
												{ __( 'Reset', 'mone' ) }
											</span>
										) }
									</MenuItem>
									<MenuItem
										aria-disabled={
											! activeIcons[ 'border-style' ]
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												'border-style': undefined,
											} );
										} }
									>
										<span className="components-menu-item__item">
											{ __( 'Border style', 'mone' ) }
										</span>
										{ activeIcons[ 'border-style' ] && (
											<span style={ restButtonStyle }>
												{ __( 'Reset', 'mone' ) }
											</span>
										) }
									</MenuItem>
									<MenuItem
										aria-disabled={
											! activeIcons[ 'border-width' ]
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												'border-width': undefined,
											} );
										} }
									>
										<span className="components-menu-item__item">
											{ __( 'Border width', 'mone' ) }
										</span>
										{ activeIcons[ 'border-width' ] && (
											<span style={ restButtonStyle }>
												{ __( 'Reset', 'mone' ) }
											</span>
										) }
									</MenuItem>
									<MenuItem
										aria-disabled={
											! activeIcons[ 'border-radius' ]
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												'border-radius': undefined,
											} );
										} }
									>
										<span className="components-menu-item__item">
											{ __( 'Border radius', 'mone' ) }
										</span>
										{ activeIcons[ 'border-radius' ] && (
											<span style={ restButtonStyle }>
												{ __( 'Reset', 'mone' ) }
											</span>
										) }
									</MenuItem>
									<MenuItem
										aria-disabled={
											! activeIcons[ 'border-color' ] &&
											! activeIcons[ 'border-style' ] &&
											! activeIcons[ 'border-width' ] &&
											! activeIcons[ 'border-radius' ]
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												'border-color': undefined,
												'border-style': undefined,
												'border-width': undefined,
												'border-radius': undefined,
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
				<ColorPalette
					value={ activeIcons[ 'border-color' ] }
					onChange={ ( newValue ) => {
						onIconChange( {
							'border-color': newValue,
							'border-style':
								activeIcons[ 'border-style' ] === undefined
									? 'solid'
									: activeIcons[ 'border-style' ],
						} );
					} }
					clearable={ false }
					enableAlpha={ true }
					__experimentalIsRenderedInSidebar={ true }
				/>
				<hr style={ { borderTop: 'none', margin: 0, width: '100%' } } />
				<ToggleGroupControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					isDeselectable
					label={ __( 'Style' ) }
					value={ activeIcons[ 'border-style' ] }
					onChange={ ( newValue ) => {
						onIconChange( {
							'border-style': newValue,
						} );
					} }
				>
					{ BORDER_STYLES.map( ( borderStyle ) => (
						<ToggleGroupControlOptionIcon
							key={ borderStyle.value }
							value={ borderStyle.value }
							icon={ borderStyle.icon }
							label={ borderStyle.label }
						/>
					) ) }
				</ToggleGroupControl>
				<hr style={ { borderTop: 'none', margin: 0, width: '100%' } } />
				<UnitControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Border width', 'mone' ) }
					max={ 100 }
					min={ 0 }
					value={ activeIcons[ 'border-width' ] }
					onChange={ ( newValue ) => {
						onIconChange( {
							'border-width': newValue,
						} );
					} }
				/>
				<hr style={ { borderTop: 'none', margin: 0, width: '100%' } } />
				<UnitControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Radius' ) }
					max={ 100 }
					min={ 0 }
					value={ activeIcons[ 'border-radius' ] }
					onChange={ ( newValue ) => {
						onIconChange( {
							'border-radius': newValue,
						} );
					} }
				/>
			</VStack>
		</>
	);
}
