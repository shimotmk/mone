/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import {
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	store as blockEditorStore,
	getColorObjectByColorValue,
	__experimentalUseGradient as useGradient,
	getTypographyClassesAndStyles as useTypographyProps,
	useSettings,
} from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { renderToString } from '@wordpress/element';
import { select } from '@wordpress/data';
import { pullLeft, pullRight, chevronDown } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';
import { IconSearchModal } from '../../components/icon-search-popover';
import {
	ReactIcon,
	createSvgUrl,
	isCustomIcon,
	decodeSvgBase64,
} from '../../components/icon-search-popover/ReactIcon';
import { colorSlugToColorCode } from '../../utils-func/color-slug-to-color-code';
import {
	existsClassName,
	toggleClass,
	deleteClassName,
	deleteClass,
} from '../../utils-func/class-name/classAttribute.js';
import { isHexColor } from '../../utils-func/is-hex-color';
import { plusMinus, blockCategoryIcon } from '../../icons';

export function registerBlockTypeDetails( settings, name ) {
	if ( name !== 'core/details' ) {
		return settings;
	}

	settings.supports = {
		...settings.supports,
		spacing: {
			...settings.supports.spacing,
			padding: false,
		},
		__experimentalBorder: {
			radius: true,
			color: true,
			width: true,
			style: true,
		},
	};

	settings.attributes = {
		...settings.attributes,
		moneSummaryOpenColor: {
			type: 'string',
		},
		moneSummaryOpenGradient: {
			type: 'string',
		},
		moneSummaryOpenCustomGradient: {
			type: 'string',
		},
		moneDetailsIconName: {
			type: 'string',
		},
		moneDetailsIcon: {
			type: 'string',
		},
		moneDetailsOpenIconName: {
			type: 'string',
		},
		moneDetailsOpenIcon: {
			type: 'string',
		},
		moneIconColor: {
			type: 'string',
		},
		moneIconGradient: {
			type: 'string',
		},
		moneIconCustomGradient: {
			type: 'string',
		},
	};

	return settings;
}

export const blockEditDetails = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes, clientId } = props;

		if ( name !== 'core/details' ) {
			return <BlockEdit { ...props } />;
		}
		const {
			moneSummaryOpenColor,
			moneDetailsIconName,
			moneDetailsIcon,
			moneDetailsOpenIconName,
			moneDetailsOpenIcon,
			moneIconColor,
			className,
		} = attributes;

		// if ( ! existsClassName( className, targetClasses ) ) {
		//  return <BlockEdit { ...props } />;
		// }

		const colorGradientSettings = useMultipleOriginColorsAndGradients();
		const { gradientValue, setGradient } = useGradient( {
			gradientAttribute: 'moneIconGradient',
			customGradientAttribute: 'moneIconCustomGradient',
		} );
		const {
			gradientValue: summaryOpenGradientValue,
			setGradient: setSummaryOpenGradientValue,
		} = useGradient( {
			gradientAttribute: 'moneSummaryOpenGradient',
			customGradientAttribute: 'moneSummaryOpenCustomGradient',
		} );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="settings">
					<ToolsPanel
						label={ __( 'Settings' ) }
						resetAll={ () => {
							setAttributes( {
								moneDetailsIconName: undefined,
								moneDetailsIcon: undefined,
								moneDetailsOpenIconName: undefined,
								moneDetailsOpenIcon: undefined,
							} );
							deleteClass(
								[
									'mone-details-icon-position-left',
									'mone-details-icon-position-right',
								],
								className,
								setAttributes
							);
						} }
						dropdownMenuProps={ useToolsPanelDropdownMenuProps() }
					>
						<ToolsPanelItem
							label={ __( 'Icon', 'mone' ) }
							isShownByDefault
							hasValue={ () => !! moneDetailsIconName }
							onDeselect={ () => {
								setAttributes( {
									moneDetailsIconName: undefined,
								} );
								deleteClass(
									[
										'mone-detail-icon-plusminus',
										'mone-detail-icon-triangle',
										'mone-detail-icon-custom',
									],
									className,
									setAttributes
								);
							} }
						>
							<ToggleGroupControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								isDeselectable
								label={ __( 'Icon', 'mone' ) }
								value={ ( () => {
									if (
										existsClassName(
											'mone-detail-icon-plusminus',
											className
										)
									) {
										return 'plusminus';
									}
									if (
										existsClassName(
											'mone-detail-icon-triangle',
											className
										)
									) {
										return 'triangle';
									}
									if (
										existsClassName(
											'mone-detail-icon-custom',
											className
										)
									) {
										return 'custom';
									}
									return undefined;
								} )() }
								onChange={ ( newValue ) => {
									let _className = className;
									if ( newValue === 'triangle' ) {
										_className = deleteClassName(
											[
												'mone-detail-icon-plusminus',
												'mone-detail-icon-triangle',
												'mone-detail-icon-custom',
											],
											_className
										);
										toggleClass(
											'mone-detail-icon-triangle',
											_className,
											setAttributes
										);
									} else if ( newValue === 'plusminus' ) {
										_className = deleteClassName(
											[
												'mone-detail-icon-plusminus',
												'mone-detail-icon-triangle',
												'mone-detail-icon-custom',
											],
											_className
										);
										toggleClass(
											'mone-detail-icon-plusminus',
											_className,
											setAttributes
										);
									} else if ( newValue === 'custom' ) {
										_className = deleteClassName(
											[
												'mone-detail-icon-plusminus',
												'mone-detail-icon-triangle',
												'mone-detail-icon-custom',
											],
											_className
										);
										toggleClass(
											'mone-detail-icon-custom',
											_className,
											setAttributes
										);
									} else {
										deleteClass(
											[
												'mone-detail-icon-plusminus',
												'mone-detail-icon-triangle',
												'mone-detail-icon-custom',
											],
											_className,
											setAttributes
										);
									}
								} }
							>
								<ToggleGroupControlOptionIcon
									label={ __( 'Triangle', 'mone' ) }
									icon={ chevronDown }
									value="triangle"
								/>
								<ToggleGroupControlOptionIcon
									label={ __( 'Plus Minus', 'mone' ) }
									icon={ plusMinus }
									value="plusminus"
								/>
								<ToggleGroupControlOptionIcon
									label={ __( 'Custom Icons', 'mone' ) }
									icon={ blockCategoryIcon }
									value="custom"
								/>
							</ToggleGroupControl>
						</ToolsPanelItem>
						<ToolsPanelItem
							label={ __( 'Icon', 'mone' ) }
							className="mone-block-editor-tools-panel-icon-settings__item"
							isShownByDefault
							hasValue={ () =>
								!! moneDetailsIconName ||
								!! moneDetailsOpenIconName
							}
							onDeselect={ () => {
								setAttributes( {
									moneDetailsIconName: undefined,
									moneDetailsIcon: undefined,
									moneDetailsOpenIconName: undefined,
									moneDetailsOpenIcon: undefined,
								} );
								deleteClass(
									[ 'mone-detail-icon-custom' ],
									className,
									setAttributes
								);
							} }
						>
							<IconSearchModal
								value={ moneDetailsIconName }
								iconSVG={
									decodeSvgBase64( moneDetailsIcon ) || ''
								}
								onChange={ ( value ) => {
									let SVG;
									const iconType = value?.iconType || value;
									if (
										typeof value === 'object' &&
										value !== null &&
										iconType === 'custom'
									) {
										SVG = isCustomIcon( iconType )
											? value.iconSVG
											: renderToString(
													<ReactIcon
														iconName={ iconType }
													/>
											  );
										setAttributes( {
											moneDetailsIconName: iconType,
											moneDetailsIcon:
												createSvgUrl( SVG ),
										} );
									} else if ( value ) {
										SVG = isCustomIcon( value )
											? value.iconSVG
											: renderToString(
													<ReactIcon
														iconName={ value }
													/>
											  );
										setAttributes( {
											moneDetailsIconName: value,
											moneDetailsIcon:
												createSvgUrl( SVG ),
										} );
									} else {
										setAttributes( {
											moneDetailsIconName: undefined,
											moneDetailsIcon: undefined,
										} );
									}
								} }
							/>
							<IconSearchModal
								label={ __( 'Open icon', 'mone' ) }
								value={ moneDetailsOpenIconName }
								iconSVG={
									decodeSvgBase64( moneDetailsOpenIcon ) || ''
								}
								onChange={ ( value ) => {
									let SVG;
									const iconType = value?.iconType || value;
									if (
										typeof value === 'object' &&
										value !== null &&
										iconType === 'custom'
									) {
										SVG = isCustomIcon( iconType )
											? value.iconSVG
											: renderToString(
													<ReactIcon
														iconName={ iconType }
													/>
											  );
										setAttributes( {
											moneDetailsOpenIconName: iconType,
											moneDetailsOpenIcon:
												createSvgUrl( SVG ),
										} );
									} else if ( value ) {
										SVG = isCustomIcon( value )
											? value.iconSVG
											: renderToString(
													<ReactIcon
														iconName={ value }
													/>
											  );
										setAttributes( {
											moneDetailsOpenIconName: value,
											moneDetailsOpenIcon:
												createSvgUrl( SVG ),
										} );
									} else {
										setAttributes( {
											moneDetailsOpenIconName: undefined,
											moneDetailsOpenIcon: undefined,
										} );
									}
								} }
							/>
						</ToolsPanelItem>
						<ToolsPanelItem
							label={ __( 'Icon Position', 'mone' ) }
							isShownByDefault
							hasValue={ () =>
								existsClassName(
									'mone-details-icon-position-left',
									className
								) ||
								existsClassName(
									'mone-details-icon-position-right',
									className
								)
							}
							onDeselect={ () =>
								deleteClass(
									[
										'mone-details-icon-position-left',
										'mone-details-icon-position-right',
									],
									className,
									setAttributes
								)
							}
						>
							<ToggleGroupControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								isDeselectable
								label={ __( 'Icon Position', 'mone' ) }
								value={
									existsClassName(
										'mone-details-icon-position-left',
										className
									)
										? 'left'
										: existsClassName(
												'mone-details-icon-position-right',
												className
										  )
										? 'right'
										: undefined
								}
								onChange={ ( newValue ) => {
									let _className = className;
									if ( newValue === 'left' ) {
										_className = deleteClassName(
											'mone-details-icon-position-right',
											_className
										);
										toggleClass(
											'mone-details-icon-position-left',
											_className,
											setAttributes
										);
									} else if ( newValue === 'right' ) {
										_className = deleteClassName(
											'mone-details-icon-position-left',
											_className
										);
										toggleClass(
											'mone-details-icon-position-right',
											_className,
											setAttributes
										);
									} else {
										deleteClass(
											[
												'mone-details-icon-position-left',
												'mone-details-icon-position-right',
											],
											_className,
											setAttributes
										);
									}
								} }
							>
								<ToggleGroupControlOptionIcon
									label="Left"
									icon={ pullLeft }
									value="left"
								/>
								<ToggleGroupControlOptionIcon
									label="Right"
									icon={ pullRight }
									value="right"
								/>
							</ToggleGroupControl>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						__experimentalIsRenderedInSidebar
						settings={ [
							{
								colorValue:
									colorSlugToColorCode( moneIconColor ),
								label: __( 'Icon Color', 'mone' ),
								onColorChange: ( newValue ) => {
									const colorSet =
										select( blockEditorStore ).getSettings()
											.colors;
									const ColorValue =
										getColorObjectByColorValue(
											colorSet,
											newValue
										);

									if ( ColorValue !== undefined ) {
										setAttributes( {
											moneIconColor: ColorValue.slug,
										} );
									} else {
										setAttributes( {
											moneIconColor: newValue,
										} );
									}
								},
								resetAllFilter: () => {
									setAttributes( {
										moneIconColor: undefined,
										moneIconGradient: undefined,
										moneIconCustomGradient: undefined,
									} );
								},
								gradientValue,
								onGradientChange: setGradient,
								enableAlpha: true,
								clearable: true,
							},
							{
								colorValue:
									colorSlugToColorCode(
										moneSummaryOpenColor
									),
								label: __( 'Title Open Background', 'mone' ),
								onColorChange: ( newValue ) => {
									const colorSet =
										select( blockEditorStore ).getSettings()
											.colors;
									const ColorValue =
										getColorObjectByColorValue(
											colorSet,
											newValue
										);

									if ( ColorValue !== undefined ) {
										setAttributes( {
											moneSummaryOpenColor:
												ColorValue.slug,
										} );
									} else {
										setAttributes( {
											moneSummaryOpenColor: newValue,
										} );
									}
								},
								resetAllFilter: () => {
									setAttributes( {
										moneSummaryOpenColor: undefined,
										moneSummaryOpenGradient: undefined,
										moneSummaryOpenCustomGradient:
											undefined,
									} );
								},
								gradientValue: summaryOpenGradientValue,
								onGradientChange: setSummaryOpenGradientValue,
								enableAlpha: true,
								clearable: true,
							},
						] }
						panelId={ clientId }
						{ ...colorGradientSettings }
					/>
				</InspectorControls>
			</>
		);
	}
);

/**
 * Override the default block element to include elements styles.
 */
const blockListBlockDetails = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		const { name, attributes, wrapperProps } = props;
		if ( name !== 'core/details' ) {
			return <BlockListBlock { ...props } />;
		}
		const {
			moneSummaryOpenColor,
			moneSummaryOpenGradient,
			moneSummaryOpenCustomGradient,
			moneIconColor,
			moneDetailsIcon,
			moneDetailsOpenIcon,
			moneIconGradient,
			moneIconCustomGradient,
		} = attributes;

		const [ fluidTypographySettings, layout ] = useSettings(
			'typography.fluid',
			'layout'
		);
		const typographyProps = useTypographyProps( attributes, {
			typography: {
				fluid: fluidTypographySettings,
			},
			layout: {
				wideSize: layout?.wideSize,
			},
		} );

		const extraStyle = {
			'--the-summary-icon-custom': moneDetailsIcon
				? `url(${ moneDetailsIcon })`
				: undefined,
			'--the-summary-open-icon-custom': moneDetailsOpenIcon
				? `url(${ moneDetailsOpenIcon })`
				: undefined,
			'--the-summary-open-background-custom': moneSummaryOpenGradient
				? `var(--wp--preset--gradient--${ moneSummaryOpenGradient })`
				: moneSummaryOpenCustomGradient ||
				  ( moneSummaryOpenColor &&
						( isHexColor( moneSummaryOpenColor )
							? moneSummaryOpenColor
							: `var(--wp--preset--color--${ moneSummaryOpenColor })` ) ),
			'--the-summary-icon-color-custom': moneIconGradient
				? `var(--wp--preset--gradient--${ moneIconGradient })`
				: moneIconCustomGradient ||
				  ( moneIconColor &&
						( isHexColor( moneIconColor )
							? moneIconColor
							: `var(--wp--preset--color--${ moneIconColor })` ) ),
			'--the-summary-icon-size': attributes.fontSize
				? `var(--wp--preset--font-size--${ attributes.fontSize })`
				: typographyProps.style.fontSize,
		};

		const blockWrapperProps = {
			...wrapperProps,
			style: {
				...( wrapperProps && { ...wrapperProps.style } ),
				...extraStyle,
			},
		};

		return (
			<>
				<BlockListBlock
					{ ...props }
					wrapperProps={ blockWrapperProps }
				/>
			</>
		);
	}
);

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/details',
	registerBlockTypeDetails
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/details',
	blockEditDetails
);

addFilter(
	'editor.BlockListBlock',
	'mone/editor/block-list-block/details',
	blockListBlockDetails
);
