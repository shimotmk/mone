/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useState, useMemo, renderToString } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { PHOSPHOR_ICONS } from '../icon-list/phosphor-icons';
import { ReactIcon, parseIconName } from '../ReactIcon';

export const PhosphorIcon = ( { iconName, onChange } ) => {
	const { iconType: type } = parseIconName( iconName );
	const _iconType = type || 'light';
	const [ iconType, setIconType ] = useState( _iconType );

	const filteredIcons = useMemo( () => {
		return PHOSPHOR_ICONS.filter( ( phIconName ) => {
			const { iconType: extractedType } = parseIconName( phIconName );
			return extractedType === iconType;
		} );
	}, [ iconType ] );

	return (
		<>
			<div className="mone-icon-type-toggle-wrapper">
				<div className="mone-icon-type-toggle">
					<ToggleGroupControl
						value={ iconType }
						isBlock
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						onChange={ ( value ) => setIconType( value ) }
					>
						<ToggleGroupControlOption value="thin" label="Thin" />
						<ToggleGroupControlOption value="light" label="Light" />
						<ToggleGroupControlOption value="bold" label="Bold" />
					</ToggleGroupControl>
				</div>
			</div>
			<div className="mone-icon-button-wrapper">
				{ filteredIcons.map( ( icon, idx ) => {
					return (
						<Button
							className="mone-icon-button fi"
							key={ idx }
							variant={
								icon === iconName ? 'primary' : undefined
							}
							onClick={ () => {
								const newIcon =
									icon === iconName ? undefined : icon;
								const iconSvgString =
									icon === iconName
										? undefined
										: renderToString(
												<ReactIcon iconName={ icon } />
										  );
								onChange( {
									iconType: newIcon,
									iconSVG: iconSvgString,
								} );
							} }
							label={ icon }
						>
							<ReactIcon iconName={ icon } size="100%" />
						</Button>
					);
				} ) }
			</div>
		</>
	);
};
