import clsx from 'clsx';

import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { getPath } from '@wordpress/url';

import {
	stringToArrayClassName,
	toggleClass,
	existsClassName,
	deleteClass,
} from '../../utils-func/class-name/classAttribute.js';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

const isSiteEditor = getPath( window.location.href )?.includes(
	'site-editor.php'
);

function TableOfContentEdit( props ) {
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const {
		attributes,
		setAttributes,
		clientId,
		deactivateTextColor,
		setDeactivateTextColor,
		beforeColor,
		setBeforeColor,
		beforeDeactivateColor,
		setBeforeDeactivateColor,
		lineColor,
		setLineColor,
	} = props;
	const { className } = attributes;
	const classArray = stringToArrayClassName( className );
	const hasDefaultTocStyle = classArray.includes(
		'is-style-mone-default-toc'
	);
	const scrollAnimationClassName = 'mone-is-scroll-animation';

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-deactivate-text-color` ]:
				existsClassName( className, scrollAnimationClassName ) &&
				!! deactivateTextColor.color,
			[ `has-before-color` ]: !! beforeColor.color,
			[ `has-before-deactivate-color` ]:
				existsClassName( className, scrollAnimationClassName ) &&
				!! beforeDeactivateColor.color,
			[ `has-line-color` ]: !! lineColor.color,
			[ `mone-toc` ]: ! hasDefaultTocStyle,
		} ),
		style: {
			overflowY: existsClassName( className, scrollAnimationClassName )
				? 'auto'
				: undefined,
			'--the-deactivate-text-color':
				existsClassName( className, scrollAnimationClassName ) &&
				( !! deactivateTextColor?.slug
					? `var(--wp--preset--color--${ deactivateTextColor.slug })`
					: deactivateTextColor?.color ),
			'--the-before-color': !! beforeColor?.slug
				? `var(--wp--preset--color--${ beforeColor.slug })`
				: beforeColor?.color,
			'--the-before-deactivate-color':
				existsClassName( className, scrollAnimationClassName ) &&
				( !! beforeDeactivateColor?.slug
					? `var(--wp--preset--color--${ beforeDeactivateColor.slug })`
					: beforeDeactivateColor?.color ),
			'--the-line-color': !! lineColor?.slug
				? `var(--wp--preset--color--${ lineColor.slug })`
				: lineColor?.color,
		},
	} );

	return (
		<>
			{ isSiteEditor && (
				<InspectorControls group="settings">
					<ToolsPanel
						label={ __( 'Settings' ) }
						resetAll={ () => {
							deleteClass(
								scrollAnimationClassName,
								className,
								setAttributes
							);
						} }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							label={ __( 'Scroll animation', 'mone' ) }
							isShownByDefault
							hasValue={ () =>
								existsClassName(
									className,
									scrollAnimationClassName
								)
							}
							onDeselect={ () =>
								deleteClass(
									scrollAnimationClassName,
									className,
									setAttributes
								)
							}
						>
							<ToggleControl
								label={ __( 'Scroll animation', 'mone' ) }
								checked={ existsClassName(
									className,
									scrollAnimationClassName
								) }
								onChange={ () => {
									toggleClass(
										scrollAnimationClassName,
										className,
										setAttributes
									);
								} }
								__nextHasNoMarginBottom
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			) }
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: hasDefaultTocStyle
								? __( 'Circle Color', 'mone' )
								: __( 'Number Color', 'mone' ),
							colorValue: beforeColor.color,
							onColorChange: setBeforeColor,
							resetAllFilter: () => setBeforeColor(),
							isShownByDefault: true,
							enableAlpha: true,
							clearable: true,
						},
						...( existsClassName(
							className,
							scrollAnimationClassName
						)
							? [
									{
										label: __(
											'Deactivate text Color',
											'mone'
										),
										colorValue: deactivateTextColor.color,
										onColorChange: setDeactivateTextColor,
										resetAllFilter: () =>
											setDeactivateTextColor(),
										isShownByDefault: true,
										enableAlpha: true,
										clearable: true,
									},
									{
										label: hasDefaultTocStyle
											? __(
													'Circle deactivate Color',
													'mone'
											  )
											: __(
													'Number deactivate Color',
													'mone'
											  ),
										colorValue: beforeDeactivateColor.color,
										onColorChange: setBeforeDeactivateColor,
										resetAllFilter: () =>
											setBeforeDeactivateColor(),
										isShownByDefault: true,
										enableAlpha: true,
										clearable: true,
									},
							  ]
							: [] ),
						...( hasDefaultTocStyle
							? [
									{
										label: __( 'Line Color', 'mone' ),
										colorValue: lineColor.color,
										onColorChange: setLineColor,
										resetAllFilter: () => setLineColor(),
										isShownByDefault: true,
										enableAlpha: true,
										clearable: true,
									},
							  ]
							: [] ),
					] }
					panelId={ clientId }
					{ ...useMultipleOriginColorsAndGradients() }
					disableCustomGradients
				/>
			</InspectorControls>
			<div { ...blockProps }>
				<ol className="ol-depth-1">
					<li className="active">
						<a href="#pseudo-link">
							{ __(
								'Table of Contents Editor Preview H2 Heading',
								'mone'
							) }
						</a>
						<ol className="ol-depth-2">
							<li>
								<a href="#pseudo-link">
									{ __(
										'Table of Contents Editor Preview H3 Heading',
										'mone'
									) }
								</a>
							</li>
							<li>
								<a href="#pseudo-link">
									{ __(
										'Table of Contents Editor Preview H3 Heading',
										'mone'
									) }
								</a>
							</li>
						</ol>
					</li>
					<li>
						<a href="#pseudo-link">
							{ __(
								'Table of Contents Editor Preview H2 Heading',
								'mone'
							) }
						</a>
						<ol className="ol-depth-2">
							<li>
								<a href="#pseudo-link">
									{ __(
										'Table of Contents Editor Preview H3 Heading',
										'mone'
									) }
								</a>
								<ol className="ol-depth-3">
									<li>
										<a href="#pseudo-link">
											{ __(
												'Table of Contents Editor Preview H4 Heading',
												'mone'
											) }
										</a>
									</li>
								</ol>
							</li>
						</ol>
					</li>
				</ol>
			</div>
		</>
	);
}

export default withColors( {
	deactivateTextColor: 'color',
	beforeColor: 'color',
	beforeDeactivateColor: 'color',
	lineColor: 'color',
} )( TableOfContentEdit );
