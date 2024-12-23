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
	HeightControl,
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	classStringToClassArray,
	setClassName,
	existsClass,
	deleteClass,
} from '../../utils-func/class-name/classAttribute.js';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

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
	const { maxHeight, className } = attributes;
	const classArray = classStringToClassArray( className );
	const hasDefaultTocStyle = classArray.includes(
		'is-style-mone-default-toc'
	);
	const scrollAnimationClassName = 'mone-is-scroll-animation';

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-max-height` ]: maxHeight,
			[ `has-deactivate-text-color` ]:
				existsClass( className, scrollAnimationClassName ) &&
				!! deactivateTextColor.color,
			[ `has-before-color` ]: !! beforeColor.color,
			[ `has-before-deactivate-color` ]:
				existsClass( className, scrollAnimationClassName ) &&
				!! beforeDeactivateColor.color,
			[ `has-line-color` ]: !! lineColor.color,
			[ `mone-toc` ]: ! hasDefaultTocStyle,
		} ),
		style: {
			maxHeight,
			overflowY: maxHeight ? 'auto' : undefined,
			'--the-deactivate-text-color':
				existsClass( className, scrollAnimationClassName ) &&
				( !! deactivateTextColor?.slug
					? `var(--wp--preset--color--${ deactivateTextColor.slug })`
					: deactivateTextColor?.color ),
			'--the-before-color': !! beforeColor?.slug
				? `var(--wp--preset--color--${ beforeColor.slug })`
				: beforeColor?.color,
			'--the-before-deactivate-color':
				existsClass( className, scrollAnimationClassName ) &&
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
							existsClass( className, scrollAnimationClassName )
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
							checked={ existsClass(
								className,
								scrollAnimationClassName
							) }
							onChange={ () => {
								setClassName(
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
						},
						...( existsClass( className, scrollAnimationClassName )
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
									},
							  ]
							: [] ),
					] }
					panelId={ clientId }
					{ ...useMultipleOriginColorsAndGradients() }
					disableCustomGradients
				/>
			</InspectorControls>
			<InspectorControls group="dimensions">
				<ToolsPanelItem
					hasValue={ () => maxHeight !== undefined }
					label={ __( 'Max height', 'mone' ) }
					onDeselect={ () =>
						setAttributes( { maxHeight: undefined } )
					}
					isShownByDefault={ true }
					panelId={ clientId }
					resetAllFilter={ () => {
						setAttributes( { maxHeight: undefined } );
					} }
				>
					<HeightControl
						label={ __( 'Max height', 'mone' ) }
						value={ maxHeight }
						onChange={ ( value ) =>
							setAttributes( { maxHeight: value } )
						}
					/>
				</ToolsPanelItem>
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
										<ol className="ol-depth-4">
											<li>
												<a href="#pseudo-link">
													{ __(
														'Table of Contents Editor Preview H5 Heading',
														'mone'
													) }
												</a>
											</li>
										</ol>
									</li>
								</ol>
							</li>
						</ol>
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
										<ol className="ol-depth-4">
											<li>
												<a href="#pseudo-link">
													{ __(
														'Table of Contents Editor Preview H5 Heading',
														'mone'
													) }
												</a>
											</li>
										</ol>
									</li>
								</ol>
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
