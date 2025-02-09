/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	TextControl,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import {
	justifyTop,
	justifyBottom,
	justifyCenterVertical,
} from '../../../icons';

export function Settings( { activeIcons, onIconChange } ) {
	const buttonStyle = {
		height: '30px',
	};

	return (
		<>
			<VStack spacing={ 2 }>
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
				<HStack alignment="right">
					<Button
						onClick={ () => {
							onIconChange( { 'vertical-align': '' } );
						} }
						variant="tertiary"
						style={ buttonStyle }
					>
						{ __( 'Clear', 'mone' ) }
					</Button>
				</HStack>
				{ /* <TextControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					autoComplete="off"
					label={ __( 'Additional CSS class(es)' ) }
					value={ activeIcons.additionalClassName || '' }
					onChange={ ( nextValue ) => {
						onIconChange( { additionalClassName: nextValue } );
					} }
					help={ __( 'Separate multiple classes with spaces.' ) }
				/> */ }
			</VStack>
		</>
	);
}
