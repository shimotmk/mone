/**
 * Internal dependencies
 */
import { ReactIcon, ReactIconKinds } from './ReactIcon';
import { fiIcons } from './icon-list/feather-icons';
import { ioIcons } from './icon-list/io-icons';
import { faIcons } from './icon-list/fa-icons';
import { PhosphorLogo } from '../../icons';
import { Phosphor } from './phosphor';

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

import './editor.scss';

const ALL_ICONS = fiIcons.concat( ioIcons, faIcons );

export const IconPopoverContent = ( props ) => {
	const { onChange, value } = props;
	const iconName = value;
	const [ searchValue, setSearchValue ] = useState( '' );

	let filteredIcons = null;
	let iconList = null;

	// 検索ワードからアイコン絞り込み
	if ( searchValue ) {
		const allIcons = ALL_ICONS;
		filteredIcons = allIcons.filter( ( item ) =>
			item.toLowerCase().includes( searchValue.toLowerCase() )
		);
	}

	if ( filteredIcons ) {
		iconList = filteredIcons.length ? (
			<ButtonGroup className="mone-icon-button-group">
				{ filteredIcons.map( ( icon, idx ) => {
					return (
						<Button
							className="mone-icon-button"
							key={ idx }
							variant={
								icon === iconName ? 'primary' : undefined
							}
							onClick={ () => {
								onChange( icon );
							} }
							label={ icon }
						>
							<ReactIcon iconName={ icon } size="100%" />
						</Button>
					);
				} ) }
			</ButtonGroup>
		) : (
			<div className="no-icon">{ __( 'Icon not found.', 'mone' ) }</div>
		);
	} else {
		iconList = (
			<TabPanel
				className="mone-icon-tab"
				activeClass="is-active"
				tabs={ [
					{
						name: 'fa',
						title: (
							<ReactIcon
								iconName="FaFontAwesomeFlag"
								size="100%"
							/>
						),
					},
					{
						name: 'io',
						title: <ReactIcon iconName="IoLogoIonic" size="100%" />,
					},
					{
						name: 'fi',
						title: (
							<ReactIcon
								className="mone-icon-button-fi"
								iconName="FiFeather"
								size="100%"
							/>
						),
					},
					{
						name: 'phosphor',
						title: <Icon icon={ PhosphorLogo } size={ 42 } />,
					},
				] }
				initialTabName={ iconName ? ReactIconKinds( iconName ) : 'fa' }
			>
				{ ( tab ) => {
					if ( 'fa' === tab.name ) {
						return (
							<div className="mone-icon-tab-content">
								<ButtonGroup>
									{ faIcons.map( ( icon, idx ) => {
										return (
											<Button
												className="mone-icon-button"
												key={ idx }
												variant={
													icon === iconName
														? 'primary'
														: undefined
												}
												onClick={ () => {
													const newIcon =
														icon === iconName
															? ''
															: icon;
													onChange( newIcon );
												} }
												label={ icon }
											>
												<ReactIcon
													iconName={ icon }
													size="100%"
												/>
											</Button>
										);
									} ) }
								</ButtonGroup>
							</div>
						);
					} else if ( 'io' === tab.name ) {
						return (
							<div className="mone-icon-tab-content">
								<ButtonGroup>
									{ ioIcons.map( ( icon, idx ) => {
										return (
											<Button
												className="mone-icon-button"
												key={ idx }
												variant={
													icon === iconName
														? 'primary'
														: undefined
												}
												onClick={ () => {
													const newIcon =
														icon === iconName
															? ''
															: icon;
													onChange( newIcon );
												} }
												label={ icon }
											>
												<ReactIcon
													iconName={ icon }
													size="100%"
												/>
											</Button>
										);
									} ) }
								</ButtonGroup>
							</div>
						);
					} else if ( 'fi' === tab.name ) {
						return (
							<div className="mone-icon-tab-content">
								<ButtonGroup>
									{ fiIcons.map( ( icon, idx ) => {
										return (
											<Button
												className="mone-icon-button fi"
												key={ idx }
												variant={
													icon === iconName
														? 'primary'
														: undefined
												}
												onClick={ () => {
													const newIcon =
														icon === iconName
															? ''
															: icon;
													onChange( newIcon );
												} }
												label={ icon }
											>
												<ReactIcon
													iconName={ icon }
													size="100%"
												/>
											</Button>
										);
									} ) }
								</ButtonGroup>
							</div>
						);
					} else if ( 'phosphor' === tab.name ) {
						return (
							<Phosphor
								iconName={ iconName }
								onChange={ onChange }
							/>
						);
					}
				} }
			</TabPanel>
		);
	}

	return (
		<>
			<SearchControl
				className="mone-icon-popover__input"
				label="SearchControl"
				__nextHasNoMarginBottom
				value={ searchValue }
				onChange={ ( v ) => {
					setSearchValue( v );
				} }
			/>
			<div className="mone-icon-popover-icon-list">{ iconList }</div>
		</>
	);
};

export const IconSearchModal = ( props ) => {
	const { value, onChange } = props;
	const [ isVisible, setIsVisible ] = useState( false );

	return (
		<>
			<Button
				variant="secondary"
				onClick={ () => setIsVisible( ! isVisible ) }
			>
				{ __( 'Select Icon', 'mone' ) }
				<Icon icon={ symbol } />
			</Button>
			{ isVisible && (
				<Modal
					className="mone-icon-modal mone-icon-modal--search"
					onRequestClose={ () => setIsVisible( false ) }
				>
					<IconPopoverContent
						value={ value }
						onChange={ onChange }
						setIsVisible={ setIsVisible }
					/>
				</Modal>
			) }
		</>
	);
};
