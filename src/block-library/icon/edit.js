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
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUseCustomUnits as useCustomUnits,
	ToolbarButton,
	Popover,
} from '@wordpress/components';
import { Icon, link } from '@wordpress/icons';
import { select } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';
import { useState, useCallback, useEffect } from '@wordpress/element';

import { colorSlugToColorCode } from '../../utils-func/color-slug-to-color-code';
import { gradientSlugToGradientCode } from '../../utils-func/gradient-slug-to-gradient-code';
import { isHexColor } from '../../utils-func/is-hex-color';
import { blockCategoryIcon as icon } from './sample-icon';
import { linearGradientColorToDefSvg } from './linear-gradient-color-to-def-svg';

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
		iconColor,
		iconGradientColor,
		width,
		url,
		linkTarget,
		rel,
		hoverBackgroundColor,
	} = attributes;
	const [ isEditingURL, setIsEditingURL ] = useState( false );
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );

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

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const instanceId = useInstanceId( Edit );

	const blockProps = useBlockProps( {
		className: clsx( {
			'has-icon-color': iconColor,
			[ `has-${ iconColor }-color` ]:
				! isHexColor( iconColor ) && iconColor,
		} ),
		style: {
			width,
			color:
				! isHexColor( iconColor ) && iconColor ? undefined : iconColor,
			'--hover-background-color': isHexColor( hoverBackgroundColor )
				? hoverBackgroundColor
				: `var(--wp--preset--color--${ hoverBackgroundColor })` ||
				  undefined,
		},
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		templateInsertUpdatesSelection: true,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	} );

	const gradientSetColorCode =
		gradientSlugToGradientCode( iconGradientColor );
	const gradientSvg = linearGradientColorToDefSvg(
		gradientSetColorCode,
		`mone-icon-gradient-${ instanceId }`
	);

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
							gradientValue: iconGradientColor,
							onGradientChange: ( newValue ) => {
								setAttributes( {
									iconGradientColor: newValue,
								} );
							},
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
						href="#icon-pseudo-link"
						onClick={ ( event ) => event.preventDefault() }
						className="wp-block-mone-icon__link"
					>
						{ gradientSvg }
						<Icon
							fill={
								gradientSvg
									? `url(#mone-icon-gradient-${ instanceId })`
									: 'currentColor'
							}
							icon={ icon }
						/>
					</a>
				) : (
					<>
						{ gradientSvg }
						<Icon
							fill={
								gradientSvg
									? `url(#mone-icon-gradient-${ instanceId })`
									: 'currentColor'
							}
							icon={ icon }
						/>
					</>
				) }
			</div>
		</>
	);
}
