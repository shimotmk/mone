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
	useSettings,
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
} from '../../components/icon-search-popover/ReactIcon';

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
		iconName,
		iconColor,
		iconGradientColor,
		width,
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
	const defaultUnits = [ 'px', '%', 'vw', 'em', 'rem' ];
	const spacingUnits = [ ...useSettings( 'spacing.units' )[ 0 ] ];
	const units = useCustomUnits( {
		availableUnits: spacingUnits || defaultUnits,
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
			height: width,
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
		className: clsx( 'wp-block-mone-icon__link' ),
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

	const SVG = iconName
		? renderToString( <ReactIcon icon={ iconName } size="100%" /> )
		: '';

	return (
		<>
			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => setAttributes( { width: undefined } ) }
				>
					<ToolsPanelItem
						label={ __( 'Width', 'mone' ) }
						isShownByDefault
						hasValue={ () => !! width }
						onDeselect={ () =>
							setAttributes( { width: undefined } )
						}
					>
						<UnitControl
							label={ __( 'Width' ) }
							labelPosition="top"
							value={ width || '' }
							min={ 0 }
							onChange={ ( nextWidth ) =>
								onDimensionChange( 'width', nextWidth )
							}
							units={ units }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
				<IconSearchModal
					value={ iconName }
					onChange={ ( value ) =>
						setAttributes( { iconName: value } )
					}
				/>
			</InspectorControls>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'アイコンカラー', 'mone' ),
							resetAllFilter: () => {
								setAttributes( {
									iconColor: undefined,
									iconGradientColor: undefined,
								} );
							},
							isShownByDefault: true,
							enableAlpha: true,
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
							label: __( 'ホバー背景色', 'mone' ),
							resetAllFilter: () => {
								setAttributes( {
									hoverBackgroundColor: undefined,
								} );
							},
							isShownByDefault: true,
							enableAlpha: true,
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
							{ iconName && <ReactIcon icon={ iconName } /> }
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
							{ iconName && <ReactIcon icon={ iconName } /> }
						</span>
					</>
				) }
			</div>
		</>
	);
}
