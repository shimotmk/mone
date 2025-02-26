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
import { select } from '@wordpress/data';
import { pullLeft, pullRight, chevronDown } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';
import { IconSearchModal } from '../../components/icon-search-popover';
import {
	createSvgUrl,
	decodeSvgBase64,
} from '../../components/icon-search-popover/ReactIcon';
import { colorSlugToColorCode } from '../../utils-func/color-slug-to-color-code';
import {
	toggleClass,
	addClass,
	deleteClass,
} from '../../utils-func/class-name/classAttribute.js';
import { deleteClassName, existsClassName } from '../../utils-func/class-name';
import { isHexColor } from '../../utils-func/is-hex-color';
import { plusMinus } from '../../icons';

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
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		if ( ! existsClassName( 'is-style-mone-details-icon', className ) ) {
			return <BlockEdit { ...props } />;
		}

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
									'mone-detail-icon-triangle',
									'mone-detail-icon-custom',
									'mone-details-icon-position-left',
									'mone-details-icon-position-right',
								],
								className,
								setAttributes
							);
						} }
						dropdownMenuProps={ dropdownMenuProps }
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
								label={ __( 'Icon', 'mone' ) }
								value={ ( () => {
									if (
										moneDetailsIconName ===
											'Ph_plus_bold' &&
										moneDetailsIcon ===
											'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMjgsMTI4YTEyLDEyLDAsMCwxLTEyLDEySDE0MHY3NmExMiwxMiwwLDAsMS0yNCwwVjE0MEg0MGExMiwxMiwwLDAsMSwwLTI0aDc2VjQwYTEyLDEyLDAsMCwxLDI0LDB2NzZoNzZBMTIsMTIsMCwwLDEsMjI4LDEyOFoiPjwvcGF0aD48L3N2Zz4=' &&
										moneDetailsOpenIconName ===
											'Ph_minus_bold' &&
										moneDetailsOpenIcon ===
											'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMjgsMTI4YTEyLDEyLDAsMCwxLTEyLDEySDQwYTEyLDEyLDAsMCwxLDAtMjRIMjE2QTEyLDEyLDAsMCwxLDIyOCwxMjhaIj48L3BhdGg+PC9zdmc+'
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
									return undefined;
								} )() }
								onChange={ ( newValue ) => {
									let _className = className;
									if ( newValue === 'triangle' ) {
										_className = deleteClassName(
											[
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
										setAttributes( {
											moneDetailsIconName:
												'Ph_caret-down_bold',
											moneDetailsIcon:
												'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMTYuNDksMTA0LjQ5bC04MCw4MGExMiwxMiwwLDAsMS0xNywwbC04MC04MGExMiwxMiwwLDAsMSwxNy0xN0wxMjgsMTU5bDcxLjUxLTcxLjUyYTEyLDEyLDAsMCwxLDE3LDE3WiI+PC9wYXRoPjwvc3ZnPg==',
										} );
									} else if ( newValue === 'plusminus' ) {
										_className = deleteClassName(
											[
												'mone-detail-icon-triangle',
												'mone-detail-icon-custom',
											],
											_className
										);
										setAttributes( {
											className: `${ _className } mone-detail-icon-custom`,
											moneDetailsIconName: 'Ph_plus_bold',
											moneDetailsIcon:
												'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMjgsMTI4YTEyLDEyLDAsMCwxLTEyLDEySDE0MHY3NmExMiwxMiwwLDAsMS0yNCwwVjE0MEg0MGExMiwxMiwwLDAsMSwwLTI0aDc2VjQwYTEyLDEyLDAsMCwxLDI0LDB2NzZoNzZBMTIsMTIsMCwwLDEsMjI4LDEyOFoiPjwvcGF0aD48L3N2Zz4=',
											moneDetailsOpenIconName:
												'Ph_minus_bold',
											moneDetailsOpenIcon:
												'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMjgsMTI4YTEyLDEyLDAsMCwxLTEyLDEySDQwYTEyLDEyLDAsMCwxLDAtMjRIMjE2QTEyLDEyLDAsMCwxLDIyOCwxMjhaIj48L3BhdGg+PC9zdmc+',
										} );
									} else if ( newValue === 'custom' ) {
										_className = deleteClassName(
											[
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
									[
										'mone-detail-icon-triangle',
										'mone-detail-icon-custom',
									],
									className,
									setAttributes
								);
							} }
						>
							<IconSearchModal
								value={ moneDetailsIconName || '' }
								iconSVG={
									decodeSvgBase64( moneDetailsIcon ) || ''
								}
								onChange={ ( value ) => {
									if (
										! existsClassName(
											'mone-detail-icon-triangle',
											className
										)
									) {
										addClass(
											'mone-detail-icon-custom',
											className,
											setAttributes
										);
									}

									if ( value ) {
										setAttributes( {
											moneDetailsIconName: value.iconName,
											moneDetailsIcon: value.iconSVG
												? createSvgUrl( value.iconSVG )
												: undefined,
										} );
									} else {
										setAttributes( {
											moneDetailsIconName: undefined,
											moneDetailsIcon: undefined,
										} );
										deleteClass(
											'mone-detail-icon-custom',
											className,
											setAttributes
										);
									}
								} }
							/>
							{ ! existsClassName(
								'mone-detail-icon-triangle',
								className
							) && (
								<>
									<IconSearchModal
										label={ __(
											'Select Open icon',
											'mone'
										) }
										value={ moneDetailsOpenIconName || '' }
										iconSVG={
											decodeSvgBase64(
												moneDetailsOpenIcon
											) || ''
										}
										onChange={ ( value ) => {
											if (
												! existsClassName(
													'mone-detail-icon-triangle',
													className
												)
											) {
												addClass(
													'mone-detail-icon-custom',
													className,
													setAttributes
												);
											}

											if ( value ) {
												setAttributes( {
													moneDetailsOpenIconName:
														value.iconName,
													moneDetailsOpenIcon:
														value.iconSVG
															? createSvgUrl(
																	value.iconSVG
															  )
															: undefined,
												} );
											} else {
												setAttributes( {
													moneDetailsOpenIconName:
														undefined,
													moneDetailsOpenIcon:
														undefined,
												} );
												deleteClass(
													'mone-detail-icon-custom',
													className,
													setAttributes
												);
											}
										} }
									/>
								</>
							) }
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
							{ ( existsClassName(
								'mone-detail-icon-triangle',
								className
							) ||
								existsClassName(
									'mone-detail-icon-custom',
									className
								) ) && (
								<>
									<ToggleGroupControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										isDeselectable
										label={ __( 'Icon Position', 'mone' ) }
										value={ ( () => {
											if (
												existsClassName(
													'mone-details-icon-position-left',
													className
												)
											) {
												return 'left';
											}
											if (
												existsClassName(
													'mone-details-icon-position-right',
													className
												)
											) {
												return 'right';
											}
											return undefined;
										} )() }
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
								</>
							) }
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
			style,
			borderColor,
			className,
		} = attributes;

		if ( ! existsClassName( 'is-style-mone-details-icon', className ) ) {
			return <BlockListBlock { ...props } />;
		}

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

		let borderBottomColor = '';
		if ( style?.border?.top?.color ) {
			let value = style.border.top.color;
			const hasColorPreset = value.includes( 'var:preset|color|' );
			if ( hasColorPreset ) {
				const namedColorValue = value.substring(
					value.lastIndexOf( '|' ) + 1
				);
				value = `var(--wp--preset--color--${ namedColorValue })`;
			}
			borderBottomColor = value;
		} else {
			borderBottomColor = borderColor
				? `var(--wp--preset--color--${ borderColor })`
				: style?.border?.color || '';
		}

		const extraStyle = {
			'--the-summary-icon-custom': moneDetailsIcon
				? `url(${ moneDetailsIcon })`
				: undefined,
			'--the-summary-open-icon-custom': moneDetailsOpenIcon
				? `url(${ moneDetailsOpenIcon })`
				: undefined,
			'--the-summary-icon-size': attributes.fontSize
				? `var(--wp--preset--font-size--${ attributes.fontSize })`
				: typographyProps.style.fontSize,
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
			'--the-border-radius-top-left-custom': !! style?.border?.radius
				? style?.border?.radius
				: style?.border?.radius?.topLeft || '',
			'--the-border-radius-top-right-custom': !! style?.border?.radius
				? style?.border?.radius
				: style?.border?.radius?.topRight || '',
			'--the-border-radius-bottom-left-custom': !! style?.border?.radius
				? style?.border?.radius
				: style?.border?.radius?.topLeft || '',
			'--the-border-radius-bottom-right-custom': !! style?.border?.radius
				? style?.border?.radius
				: style?.border?.radius?.topRight || '',
			'--the-border-bottom-color-custom': borderBottomColor,
			'--the-border-bottom-style-custom': style?.border?.top?.style
				? style.border.top.style
				: style?.border?.style || '',
			'--the-border-bottom-width-custom': style?.border?.top?.width
				? style.border.top.width
				: style?.border?.width || '',
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
