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
} from '@wordpress/components';
import { moreVertical } from '@wordpress/icons';

import {
	justifyTop,
	justifyBottom,
	justifyCenterVertical,
} from '../../../icons';

export function Settings( { activeIcons, onIconChange } ) {
	return (
		<>
			<HStack
				style={ {
					padding: '8px 16px',
					borderBottom: '1px solid rgb(221, 221, 221)',
				} }
			>
				<Heading level="4">{ __( 'Settings', 'mone' ) }</Heading>
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
										! activeIcons[ 'vertical-align' ]
									}
									variant="tertiary"
									onClick={ () => {
										onIconChange( {
											'vertical-align': undefined,
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
		</>
	);
}
