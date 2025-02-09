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
} from '@wordpress/components';
import { lineDashed, lineDotted, lineSolid } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

const BORDER_STYLES = [
	{ label: __( 'Solid' ), icon: lineSolid, value: 'solid' },
	{ label: __( 'Dashed' ), icon: lineDashed, value: 'dashed' },
	{ label: __( 'Dotted' ), icon: lineDotted, value: 'dotted' },
];

export function Border( { activeIcons, onIconChange } ) {
	const buttonStyle = {
		height: '30px',
	};

	return (
		<VStack spacing={ 2 }>
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
			<HStack alignment="right">
				<Button
					onClick={ () => {
						onIconChange( {
							'border-color': '',
							'border-style': '',
							'border-radius': '',
						} );
					} }
					variant="tertiary"
					style={ buttonStyle }
				>
					{ __( 'Clear', 'mone' ) }
				</Button>
			</HStack>
		</VStack>
	);
}
