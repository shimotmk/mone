/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	Dropdown,
	MenuGroup,
	MenuItem,
	__experimentalHeading as Heading,
	TextControl,
	PanelBody,
} from '@wordpress/components';
import { moreVertical } from '@wordpress/icons';

import {
	justifyTop,
	justifyBottom,
	justifyCenterVertical,
} from '../../../icons';
import { restButtonStyle } from './index';

export function Settings( { activeIcons, onIconChange } ) {
	return (
		<>
			<HStack
				style={ {
					padding: '8px 16px',
					borderTop: '1px solid rgb(221, 221, 221)',
					borderBottom: '1px solid rgb(221, 221, 221)',
				} }
			>
				<Heading level="4">{ __( 'Settings', 'mone' ) }</Heading>
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
								'vertical-align': undefined,
								className: undefined,
							} );
						} }
						variant="tertiary"
						size="small"
						disabled={
							! activeIcons[ 'vertical-align' ] &&
							! activeIcons.className
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
								<MenuGroup label={ __( 'Settings', 'mone' ) }>
									<MenuItem
										aria-disabled={
											! activeIcons[ 'border-align' ]
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												'border-align': undefined,
											} );
										} }
									>
										<span className="components-menu-item__item">
											{ __( 'Position', 'mone' ) }
										</span>
										{ activeIcons[ 'border-align' ] && (
											<span style={ restButtonStyle }>
												{ __( 'Reset', 'mone' ) }
											</span>
										) }
									</MenuItem>
									<MenuItem
										aria-disabled={
											! activeIcons.className
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												className: undefined,
											} );
										} }
									>
										<span className="components-menu-item__item">
											{ __(
												'Additional CSS class(es)',
												'mone'
											) }
										</span>
										{ activeIcons[ 'border-align' ] && (
											<span style={ restButtonStyle }>
												{ __( 'Reset', 'mone' ) }
											</span>
										) }
									</MenuItem>
									<MenuItem
										aria-disabled={
											! activeIcons[ 'vertical-align' ] &&
											! activeIcons.className
										}
										variant="tertiary"
										onClick={ () => {
											onIconChange( {
												'vertical-align': undefined,
												className: undefined,
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
				<ToggleGroupControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					isBlock
					label={ __( 'Position', 'mone' ) }
					isDeselectable
					value={ activeIcons[ 'vertical-align' ] || '' }
					onChange={ ( newValue ) => {
						onIconChange( { 'vertical-align': newValue } );
					} }
				>
					<ToggleGroupControlOptionIcon
						label="Top"
						icon={ justifyTop }
						value="text-top"
					/>
					<ToggleGroupControlOptionIcon
						label="Middle"
						icon={ justifyCenterVertical }
						value="middle"
					/>
					<ToggleGroupControlOptionIcon
						label="Bottom"
						icon={ justifyBottom }
						value="text-bottom"
					/>
				</ToggleGroupControl>
			</VStack>
			<PanelBody
				className="mone-format-advanced"
				title={ __( 'Advanced' ) }
				initialOpen={ false }
			>
				<TextControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Additional CSS class(es)' ) }
					value={ activeIcons.className || '' }
					onChange={ ( nextValue ) => {
						onIconChange( { className: nextValue } );
					} }
					help={ __( 'Separate multiple classes with spaces.' ) }
				/>
			</PanelBody>
		</>
	);
}
