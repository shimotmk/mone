/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	ButtonGroup,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { PhosphorIconList } from '../icon-list/phosphor-icons';
import { parseIconName, generateIconName } from '../ReactIcon';

export const Phosphor = ( { iconName, onChange } ) => {
	const { iconType: type, iconNamePart: _part } = parseIconName( iconName );
	const _iconType = type || 'thin';
	const iconNamePart = _part || '';
	const [ iconType, setIconType ] = useState( _iconType );

	return (
		<>
			<div className="mone-icon-type-tab">
				<div className="mone-icon-tab-content">
					<div className="mone-icon-type-toggle-wrapper">
						<div className="mone-icon-type-toggle">
							<ToggleGroupControl
								value={ iconType }
								isBlock
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								onChange={ ( value ) => setIconType( value ) }
							>
								<ToggleGroupControlOption
									value="thin"
									label="Thin"
								/>
								<ToggleGroupControlOption
									value="light"
									label="Light"
								/>
								<ToggleGroupControlOption
									value="bold"
									label="Bold"
								/>
							</ToggleGroupControl>
						</div>
					</div>
					<ButtonGroup>
						{ PhosphorIconList.map( ( iconObj, idx ) => {
							return (
								<Button
									className="mone-icon-button fi"
									key={ idx }
									variant={
										iconObj.iconList.find(
											( icon ) => icon.type === _iconType
										) &&
										iconType === _iconType &&
										iconObj.name === iconNamePart
											? 'primary'
											: undefined
									}
									onClick={ () => {
										const newIcon =
											iconType === _iconType &&
											iconObj.name === iconNamePart
												? ''
												: generateIconName( {
														iconKind: 'Phosphor',
														iconType,
														iconNamePart:
															iconObj.name,
												  } );
										onChange( newIcon );
									} }
									label={ iconObj.name }
								>
									<Icon
										icon={
											iconObj.iconList.find(
												( icon ) =>
													icon.type === iconType
											)?.svgHtml
										}
										size={ 24 }
									/>
								</Button>
							);
						} ) }
					</ButtonGroup>
				</div>
			</div>
		</>
	);
};
