/**
 * Internal dependencies
 */
import { PhosphorIconList } from '../icon-list/phosphor-icons';

/**
 * WordPress dependencies
 */
import {
	Modal,
	Button,
	ButtonGroup,
	TabPanel,
	SearchControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Icon, symbol } from '@wordpress/icons';

export const Phosphor = ( { iconName, onChange } ) => {
	const [ iconType, setIconType ] = useState( 'thin' );

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
														iconObj.name ===
														iconName
															? 'primary'
															: undefined
													}
													onClick={ () => {
														const newIcon =
															iconObj.name ===
															iconName
																? ''
																: iconObj.name;
														// iconの識別nameをつける
														onChange( newIcon );
													} }
													label={ iconObj.name }
												>
													<Icon
														icon={
															iconObj.iconList.find(
																( iconList ) =>
																	iconList.type ===
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
