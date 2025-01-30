/**
 * Internal dependencies
 */
import { ReactIcon, IconKinds, isCustomIcon } from './ReactIcon';
import { fiIcons } from './icon-list/feather-icons';
import { ioIcons } from './icon-list/io-icons';
import { faIcons } from './icon-list/fa-icons';
import { CodeBlock } from '../../icons';
// import { CustomIcon } from './custom-icon';
import { parseIcon } from './utils/parse-icon';

/**
 * WordPress dependencies
 */
import {
	Modal,
	Button,
	ButtonGroup,
	TabPanel,
	SearchControl,
	__experimentalHStack as HStack,
	__experimentalZStack as ZStack,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
import { Icon } from '@wordpress/icons';

import './editor.scss';

export const IconPopoverContent = ( props ) => {
	const { onChange, value, iconSVG } = props;
	const iconName = value;
	const [ searchValue, setSearchValue ] = useState( '' );

	const ALL_ICONS = useMemo( () => fiIcons.concat( ioIcons, faIcons ), [] );

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
				{ filteredIcons.map( ( _iconName, idx ) => {
					return (
						<Button
							className="mone-icon-button"
							key={ idx }
							variant={
								_iconName === iconName ? 'primary' : undefined
							}
							onClick={ () => {
								onChange( _iconName );
							} }
							label={ _iconName }
						>
							<ReactIcon iconName={ _iconName } size="100%" />
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
					// {
					// 	name: 'custom',
					// 	title: <Icon icon={ CodeBlock } size={ 42 } />,
					// },
				] }
				initialTabName={ iconName ? IconKinds( iconName ) : 'fa' }
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
															? undefined
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
															? undefined
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
															? undefined
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
						// } else if ( 'custom' === tab.name ) {
						// 	return (
						// 		<CustomIcon
						// 			iconName={ iconName }
						// 			onChange={ onChange }
						// 			iconSVG={ iconSVG }
						// 		/>
						// 	);
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
	const { value, iconSVG, label } = props;
	const [ isVisible, setIsVisible ] = useState( false );
	const hasValue = !! value || !! iconSVG;

	return (
		<>
			<div className="mone-block-editor-panel-icon-settings__dropdown">
				<Button
					onClick={ () => setIsVisible( ! isVisible ) }
					__next40pxDefaultSize
				>
					<HStack justify={ hasValue ? 'start' : 'center' }>
						<ZStack isLayered={ false } offset={ -8 }>
							<Flex expanded={ false }>
								{ hasValue && value && (
									<ReactIcon iconName={ value } />
								) }
							</Flex>
						</ZStack>
						<FlexItem className="block-editor-panel-color-gradient-settings__color-name">
							{ label ? label : __( 'Select Icon', 'mone' ) }
						</FlexItem>
					</HStack>
				</Button>
			</div>
			{ isVisible && (
				<Modal
					className="mone-icon-modal mone-icon-modal--search"
					onRequestClose={ () => setIsVisible( false ) }
				>
					<IconPopoverContent
						{ ...props }
						setIsVisible={ setIsVisible }
					/>
				</Modal>
			) }
		</>
	);
};
