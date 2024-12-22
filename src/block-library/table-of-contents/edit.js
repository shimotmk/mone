import clsx from 'clsx';

import { __ } from '@wordpress/i18n';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	HeightControl,
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { classStringToClassArray } from '../../utils-func/class-name/classAttribute.js';

function TableOfContentEdit( props ) {
	const {
		attributes,
		setAttributes,
		clientId,
		deactivateTextColor,
		setDeactivateTextColor,
		circleColor,
		setCircleColor,
		lineColor,
		setLineColor,
	} = props;
	const { maxHeight, className } = attributes;
	const classArray = classStringToClassArray( className );
	const hasDefaultTocStyle = classArray.includes(
		'is-style-mone-default-toc'
	);

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-max-height` ]: maxHeight,
			[ `has-deactivate-text-color` ]: !! deactivateTextColor.color,
			[ `has-circle-color` ]: !! circleColor.color,
			[ `has-line-color` ]: !! lineColor.color,
			[ `mone-toc` ]: ! hasDefaultTocStyle,
		} ),
		style: {
			maxHeight,
			overflowY: maxHeight ? 'auto' : undefined,
			'--the-deactivate-text-color': !! deactivateTextColor?.slug
				? `var(--wp--preset--color--${ deactivateTextColor.slug })`
				: deactivateTextColor?.color,
			'--the-circle-color': !! circleColor?.slug
				? `var(--wp--preset--color--${ circleColor.slug })`
				: circleColor?.color,
			'--the-line-color': !! lineColor?.slug
				? `var(--wp--preset--color--${ lineColor.slug })`
				: lineColor?.color,
		},
	} );

	return (
		<>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'Deactivate text Color', 'mone' ),
							colorValue: deactivateTextColor.color,
							onColorChange: setDeactivateTextColor,
							resetAllFilter: () => setDeactivateTextColor(),
							isShownByDefault: true,
							enableAlpha: true,
						},
						{
							label: hasDefaultTocStyle
								? __( 'Circle Color', 'mone' )
								: __( 'Number Color', 'mone' ),
							colorValue: circleColor.color,
							onColorChange: setCircleColor,
							resetAllFilter: () => setCircleColor(),
							isShownByDefault: true,
							enableAlpha: true,
						},
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
								'目次エディター プレビュー H2見出し',
								'mone'
							) }
						</a>
						<ol className="ol-depth-2">
							<li>
								<a href="#pseudo-link">
									{ __(
										'目次エディター プレビュー H3見出し',
										'mone'
									) }
								</a>
							</li>
							<li>
								<a href="#pseudo-link">
									{ __(
										'目次エディター プレビュー H3見出し',
										'mone'
									) }
								</a>
							</li>
						</ol>
					</li>
					<li>
						<a href="#pseudo-link">
							{ __(
								'目次エディター プレビュー H2見出し',
								'mone'
							) }
						</a>
						<ol className="ol-depth-2">
							<li>
								<a href="#pseudo-link">
									{ __(
										'目次エディター プレビュー H3見出し',
										'mone'
									) }
								</a>
								<ol className="ol-depth-3">
									<li>
										<a href="#pseudo-link">
											{ __(
												'目次エディター プレビュー H4見出し',
												'mone'
											) }
										</a>
										<ol className="ol-depth-4">
											<li>
												<a href="#pseudo-link">
													{ __(
														'目次エディター プレビュー H5見出し',
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
										'目次エディター プレビュー H3見出し',
										'mone'
									) }
								</a>
								<ol className="ol-depth-3">
									<li>
										<a href="#pseudo-link">
											{ __(
												'目次エディター プレビュー H4見出し',
												'mone'
											) }
										</a>
										<ol className="ol-depth-4">
											<li>
												<a href="#pseudo-link">
													{ __(
														'目次エディター プレビュー H5見出し',
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
								'目次エディター プレビュー H2見出し',
								'mone'
							) }
						</a>
						<ol className="ol-depth-2">
							<li>
								<a href="#pseudo-link">
									{ __(
										'目次エディター プレビュー H3見出し',
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
	circleColor: 'color',
	lineColor: 'color',
} )( TableOfContentEdit );
