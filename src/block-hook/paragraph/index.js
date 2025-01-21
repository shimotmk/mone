/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
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
	__experimentalGetGapCSSValue as getGapCSSValue,
} from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { renderToString, useEffect } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';
import { IconSearchModal } from '../../components/icon-search-popover';
import {
	ReactIcon,
	createSvgUrl,
} from '../../components/icon-search-popover/ReactIcon';
import { colorSlugToColorCode } from '../../utils-func/color-slug-to-color-code';
import { existsClassName } from '../../utils-func/class-name/classAttribute.js';
import { isHexColor } from '../../utils-func/is-hex-color';

const targetClasses = [
	'is-style-mone-alert-red',
	'is-style-mone-alert-blue',
	'is-style-mone-alert-yellow',
];

export function registerBlockTypeParagraph( settings, name ) {
	if ( name !== 'core/paragraph' ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		moneAlertIconColor: {
			type: 'string',
		},
		moneAlertIconSize: {
			type: 'string',
		},
		moneAlertIconName: {
			type: 'string',
		},
		moneAlertIcon: {
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

export const blockEditParagraph = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes, clientId } = props;
		if ( name !== 'core/paragraph' ) {
			return <BlockEdit { ...props } />;
		}
		const {
			moneAlertIconColor,
			moneAlertIconName,
			moneAlertIcon,
			className,
		} = attributes;
		if ( ! existsClassName( className, targetClasses ) ) {
			return <BlockEdit { ...props } />;
		}

		const colorGradientSettings = useMultipleOriginColorsAndGradients();
		const { gradientValue, setGradient } = useGradient( {
			gradientAttribute: 'moneIconGradient',
			customGradientAttribute: 'moneIconCustomGradient',
		} );

		useEffect( () => {
			if ( moneAlertIconName ) {
				const SVG = renderToString(
					<ReactIcon
						icon={ moneAlertIconName }
						size="100%"
						color={ moneAlertIconColor }
					/>
				);
				const dataSvg = createSvgUrl( SVG );

				setAttributes( {
					moneAlertIcon: dataSvg,
				} );
			}
		}, [
			moneAlertIconName,
			moneAlertIcon,
			moneAlertIconColor,
			setAttributes,
		] );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="settings">
					<ToolsPanel
						label={ __( 'Settings' ) }
						resetAll={ () =>
							setAttributes( {
								moneAlertIconName: undefined,
								moneAlertIcon: undefined,
							} )
						}
						dropdownMenuProps={ useToolsPanelDropdownMenuProps() }
					>
						<ToolsPanelItem
							label={ __( 'Icon', 'mone' ) }
							isShownByDefault
							hasValue={ () => !! moneAlertIconName }
							onDeselect={ () =>
								setAttributes( {
									moneAlertIconName: undefined,
								} )
							}
						>
							<IconSearchModal
								value={ moneAlertIconName }
								onChange={ ( value ) => {
									setAttributes( {
										moneAlertIconName: value,
									} );
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
								colorValue:
									colorSlugToColorCode( moneAlertIconColor ),
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
											moneAlertIconColor: ColorValue.slug,
										} );
									} else {
										setAttributes( {
											moneAlertIconColor: newValue,
										} );
									}
								},
								resetAllFilter: () => {
									setAttributes( {
										moneAlertIconColor: undefined,
										moneIconGradient: undefined,
										moneIconCustomGradient: undefined,
									} );
								},
								gradientValue,
								onGradientChange: setGradient,
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
const blockListBlockParagraph = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		const { name, attributes, wrapperProps } = props;
		if ( name !== 'core/paragraph' ) {
			return <BlockListBlock { ...props } />;
		}
		const {
			moneAlertIconColor,
			moneAlertIcon,
			moneIconGradient,
			moneIconCustomGradient,
			className,
			style,
		} = attributes;
		if ( ! existsClassName( className, targetClasses ) ) {
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
		const paddingTop =
			style?.spacing?.padding?.top &&
			getGapCSSValue( style?.spacing?.padding?.top );
		const paddingLeft =
			style?.spacing?.padding?.left &&
			getGapCSSValue( style?.spacing?.padding?.left );

		const extraStyle = {
			'--the-alert-icon-custom': moneAlertIcon
				? `url(${ moneAlertIcon })`
				: undefined,
			'--the-alert-icon-color-custom': moneIconGradient
				? `var(--wp--preset--gradient--${ moneIconGradient })`
				: moneIconCustomGradient ||
				  ( moneAlertIconColor &&
						( isHexColor( moneAlertIconColor )
							? moneAlertIconColor
							: `var(--wp--preset--color--${ moneAlertIconColor })` ) ),
			'--the-alert-icon-padding-top-custom': paddingTop || undefined,
			'--the-alert-icon-padding-left-custom':
				paddingLeft !== '0' ? paddingLeft : '0px',
			'--the-alert-font-size': attributes.fontSize
				? `var(--wp--preset--font-size--${ attributes.fontSize })`
				: typographyProps.style.fontSize,
			paddingLeft: `calc( var( --the-alert-icon-padding-left-custom, calc(var(--wp--preset--spacing--10) )) + ( var(--the-alert-font-size, var(--wp--preset--font-size--medium)) * 1.5 ) + var(--the-alert-icon-text-gap) )`,
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
	'mone/blocks/register-block-type/paragraph',
	registerBlockTypeParagraph
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/paragraph',
	blockEditParagraph
);

addFilter(
	'editor.BlockListBlock',
	'mone/editor/block-list-block/paragraph',
	blockListBlockParagraph,
	9
);
