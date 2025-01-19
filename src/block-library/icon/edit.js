/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
	getColorObjectByColorValue,
	__experimentalLinkControl as LinkControl,
	__experimentalUseGradient as useGradient,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUseCustomUnits as useCustomUnits,
	ToolbarButton,
	Popover,
} from '@wordpress/components';
import { link } from '@wordpress/icons';
import { select } from '@wordpress/data';
import {
	useState,
	useCallback,
	useEffect,
	renderToString,
} from '@wordpress/element';

import { colorSlugToColorCode } from '../../utils-func/color-slug-to-color-code';
import { isHexColor } from '../../utils-func/is-hex-color';
import { IconSearchModal } from '../../components/icon-search-popover';
import {
	ReactIcon,
	createSvgUrl,
	isCustomIcon,
} from '../../components/icon-search-popover/ReactIcon';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';
import { parseIcon } from '../../components/icon-search-popover/utils/parse-icon';

const ALLOWED_BLOCKS = [ 'mone/icon' ];

const LINK_SETTINGS = [
	...LinkControl.DEFAULT_LINK_SETTINGS,
	{
		id: 'nofollow',
		title: __( 'Mark as nofollow', 'mone' ),
	},
];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const {
		iconSVG,
		iconName,
		iconColor,
		width,
		height,
		url,
		linkTarget,
		rel,
		hoverBackgroundColor,
		iconGradient,
		iconCustomGradient,
	} = attributes;
	const [ isEditingURL, setIsEditingURL ] = useState( false );
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );
	const spacingProps = useSpacingProps( attributes );

	const onDimensionChange = ( dimension, nextValue ) => {
		const parsedValue = parseFloat( nextValue );
		if ( isNaN( parsedValue ) && nextValue ) {
			return;
		}
		setAttributes( {
			[ dimension ]: parsedValue < 0 ? '0' : nextValue,
		} );
	};
	const defaultUnits = [ 'px', 'vw', 'em', 'rem', 'vh' ];
	const units = useCustomUnits( {
		availableUnits: defaultUnits,
	} );

	const { gradientValue, setGradient } = useGradient( {
		gradientAttribute: 'iconGradient',
		customGradientAttribute: 'iconCustomGradient',
	} );

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const blockProps = useBlockProps( {
		className: clsx( {
			'has-icon-color': iconColor,
			'has-icon-gradient-color': gradientValue,
		} ),
		style: {
			width,
			height,
			'--hover-background-color': hoverBackgroundColor
				? ( isHexColor( hoverBackgroundColor )
						? hoverBackgroundColor
						: `var(--wp--preset--color--${ hoverBackgroundColor })` ) ||
				  undefined
				: undefined,
			'--the-icon-color': iconGradient
				? `var(--wp--preset--gradient--${ iconGradient })`
				: iconCustomGradient ||
				  ( iconColor &&
						( isHexColor( iconColor )
							? iconColor
							: `var(--wp--preset--color--${ iconColor })` ) ),
			...( !!! url ? spacingProps.style : {} ),
		},
	} );

	const linkAttributes = {
		className: 'wp-block-mone-icon__link',
		style: {
			...spacingProps.style,
		},
	};

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		templateInsertUpdatesSelection: true,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	} );

	const popoverClose = useCallback(
		( event ) => {
			if ( ! isEditingURL ) {
				return;
			}
			const isPopover = event.target.closest( '.components-popover' );
			const isSearchItemButton = event.target.closest(
				'.block-editor-link-control__search-item-top button:nth-of-type(1)'
			);
			setIsEditingURL( !! isPopover || isSearchItemButton );
		},
		[ isEditingURL ]
	);

	useEffect( () => {
		document.body.addEventListener( 'click', popoverClose );
		return () => document.body.removeEventListener( 'click', popoverClose );
	}, [ popoverClose ] );

	let SVG;
	if ( iconName && isCustomIcon( iconName ) ) {
		SVG = iconSVG;
	} else if ( iconName ) {
		SVG = renderToString( <ReactIcon iconName={ iconName } /> );
	} else {
		SVG = renderToString( <ReactIcon iconName="FaWordpress" /> );
	}

	return (
		<>
			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () =>
						setAttributes( { width: undefined, height: undefined } )
					}
					dropdownMenuProps={ useToolsPanelDropdownMenuProps() }
				>
					<ToolsPanelItem
						label={ __( 'Size', 'mone' ) }
						isShownByDefault
						hasValue={ () => !! width }
						onDeselect={ () =>
							setAttributes( {
								width: undefined,
								height: undefined,
							} )
						}
					>
						<UnitControl
							label={ __( 'Size', 'mone' ) }
							labelPosition="top"
							value={ width || '' }
							min={ 0 }
							onChange={ ( nextWidth ) => {
								onDimensionChange( 'width', nextWidth );
								onDimensionChange( 'height', nextWidth );
							} }
							units={ units }
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						className="mone-block-editor-tools-panel-icon-settings__item"
						label={ __( 'Icon', 'mone' ) }
						isShownByDefault
						hasValue={ () => !! iconName }
						onDeselect={ () =>
							setAttributes( { iconName: undefined } )
						}
					>
						<IconSearchModal
							value={ iconName }
							iconSVG={ iconSVG }
							onChange={ ( value ) => {
								if (
									typeof value === 'object' &&
									value !== null &&
									value.iconType === 'custom'
								) {
									setAttributes( {
										iconName: value.iconType,
										iconSVG: value.iconSVG,
									} );
								} else {
									setAttributes( {
										iconName: value,
									} );
								}
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'Icon Color', 'mone' ),
							resetAllFilter: () => {
								setAttributes( {
									iconColor: undefined,
								} );
							},
							isShownByDefault: true,
							enableAlpha: true,
							clearable: true,
							colorValue: colorSlugToColorCode( iconColor ),
							onColorChange: ( newValue ) => {
								const colorSet =
									select( blockEditorStore ).getSettings()
										.colors;
								const ColorValue = getColorObjectByColorValue(
									colorSet,
									newValue
								);

								if ( ColorValue !== undefined ) {
									setAttributes( {
										iconColor: ColorValue.slug,
									} );
								} else {
									setAttributes( {
										iconColor: newValue,
									} );
								}
							},
							gradientValue,
							onGradientChange: setGradient,
						},
						{
							label: __( 'Hover background Color', 'mone' ),
							resetAllFilter: () => {
								setAttributes( {
									hoverBackgroundColor: undefined,
								} );
							},
							isShownByDefault: true,
							enableAlpha: true,
							clearable: true,
							colorValue:
								colorSlugToColorCode( hoverBackgroundColor ),
							onColorChange: ( newValue ) => {
								const colorSet =
									select( blockEditorStore ).getSettings()
										.colors;
								const ColorValue = getColorObjectByColorValue(
									colorSet,
									newValue
								);

								if ( ColorValue !== undefined ) {
									setAttributes( {
										hoverBackgroundColor: ColorValue.slug,
									} );
								} else {
									setAttributes( {
										hoverBackgroundColor: newValue,
									} );
								}
							},
						},
					] }
					panelId={ clientId }
					{ ...colorGradientSettings }
				/>
			</InspectorControls>
			<BlockControls group="block">
				<ToolbarButton
					ref={ setPopoverAnchor }
					name="link"
					icon={ link }
					title={ __( 'Link', 'mone' ) }
					onClick={ () => setIsEditingURL( true ) }
					isActive={ !! url || isEditingURL }
				/>
				{ isEditingURL && (
					<Popover
						anchor={ popoverAnchor }
						onClose={ () => setIsEditingURL( false ) }
						placement="bottom"
						focusOnMount={ true }
						offset={ 12 }
						variant="alternate"
					>
						<LinkControl
							value={ {
								url,
								opensInNewTab: linkTarget === '_blank',
								nofollow: !! rel ? true : false,
							} }
							onChange={ ( {
								url: newURL = '',
								opensInNewTab,
								nofollow: newNofollow,
							} ) => {
								setAttributes( {
									url: newURL,
									linkTarget: opensInNewTab
										? '_blank'
										: undefined,
									rel: newNofollow ? 'nofollow' : undefined,
								} );
							} }
							onRemove={ () => {
								setAttributes( {
									url: undefined,
									linkTarget: undefined,
									rel: undefined,
								} );
								setIsEditingURL( false );
							} }
							settings={ LINK_SETTINGS }
						/>
					</Popover>
				) }
			</BlockControls>
			<div { ...innerBlocksProps }>
				{ !! url ? (
					<a
						{ ...linkAttributes }
						href="#icon-pseudo-link"
						onClick={ ( event ) => event.preventDefault() }
					>
						<span
							className="wp-block-mone-icon-mask-image"
							aria-hidden="true"
							style={ {
								'--the-icon-svg': `url(${ createSvgUrl(
									SVG
								) })`,
							} }
						>
							{ ( () => {
								if (
									iconName &&
									isCustomIcon( iconName ) &&
									!! SVG
								) {
									return parseIcon( SVG );
								} else if ( iconName ) {
									return <ReactIcon iconName={ iconName } />;
								}
								return <ReactIcon iconName="FaWordpress" />;
							} )() }
						</span>
					</a>
				) : (
					<>
						<span
							className="wp-block-mone-icon-mask-image"
							aria-hidden="true"
							style={ {
								'--the-icon-svg': `url(${ createSvgUrl(
									SVG
								) })`,
							} }
						>
							{ ( () => {
								if (
									iconName &&
									isCustomIcon( iconName ) &&
									!! SVG
								) {
									return parseIcon( SVG );
								} else if ( iconName ) {
									return <ReactIcon iconName={ iconName } />;
								}
								return <ReactIcon iconName="FaWordpress" />;
							} )() }
						</span>
					</>
				) }
			</div>
		</>
	);
}
