/**
 * Internal dependencies
 */
import { PhosphorIconList } from '../icon-list/phosphor-icons';

/**
 * WordPress dependencies
 */
import { Button, ButtonGroup, TabPanel } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';

export const Phosphor = ( { iconName, onChange } ) => {
	const parts = iconName?.includes( '_' ) ? iconName.split( '_' ) : [];
	const _iconType = parts[ 1 ] || '';
	const iconNamePart = parts[ 2 ] || '';
	const [ iconType, setIconType ] = useState( _iconType );

	return (
		<>
			<TabPanel
				className="mone-icon-type-tab"
				activeClass="is-active"
				tabs={ [
					{
						name: 'thin',
						title: 'thin',
					},
					{
						name: 'light',
						title: 'light',
					},
					{
						name: 'bold',
						title: 'bold',
					},
				] }
				initialTabName={ iconType }
				onSelect={ ( value ) => setIconType( value ) }
			>
				{ () => {
					return (
						<>
							<div className="mone-icon-tab-content">
								<ButtonGroup>
									{ PhosphorIconList.map(
										( iconObj, idx ) => {
											return (
												<Button
													className="mone-icon-button fi"
													key={ idx }
													variant={
														iconObj.iconList.find(
															( icon ) =>
																icon.type ===
																_iconType
														) &&
														iconObj.name ===
															iconNamePart
															? 'primary'
															: undefined
													}
													onClick={ () => {
														const newIcon =
															iconObj.name ===
															iconNamePart
																? ''
																: `Phosphor_${ iconType }_${ iconObj.name }`;
														onChange( newIcon );
													} }
													label={ iconObj.name }
												>
													<Icon
														icon={
															iconObj.iconList.find(
																( icon ) =>
																	icon.type ===
																	iconType
															)?.svgHtml
														}
														size={ 24 }
													/>
												</Button>
											);
										}
									) }
								</ButtonGroup>
							</div>
						</>
					);
				} }
			</TabPanel>
		</>
	);
};
