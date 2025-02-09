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
			</VStack>
		</>
	);
}
