import clsx from 'clsx';

import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	InspectorControls,
	__experimentalGetGapCSSValue as getGapCSSValue,
	Warning,
} from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	ToggleControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import {
	Icon,
	justifyLeft,
	justifyCenter,
	justifyRight,
} from '@wordpress/icons';

import './style.scss';
import {
	setClassName,
	existsClass,
	deleteClass,
} from '../../utils-func/class-name/classAttribute.js';

export function registerBlockTypePostTemplate( settings, name ) {
	if ( name !== 'core/post-template' ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		moneScrollSnap: {
			type: 'string',
		},
		moneScrollSnapAlign: {
			type: 'string',
		},
	};

	settings.supports = {
		...settings.supports,
		spacing: {
			padding: true,
			blockGap: true,
			__experimentalDefaultControls: {
				blockGap: true,
				padding: false,
			},
		},
		__experimentalBorder: {
			radius: true,
			color: true,
			width: true,
			style: true,
		},
	};

	return settings;
}

export const blockEditPostTemplate = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		if ( name !== 'core/post-template' ) {
			return <BlockEdit { ...props } />;
		}
		const { layout, moneScrollSnap, moneScrollSnapAlign, className } =
			attributes;
		const columnCount = layout?.columnCount || null;
		const scrollClassName = 'mone-scroll';

		useEffect( () => {
			if ( layout?.type !== 'grid' ) {
				setAttributes( {
					moneScroll: undefined,
					moneScrollSnap: undefined,
					moneScrollSnapAlign: undefined,
				} );
				deleteClass( scrollClassName, className, setAttributes );
			}
		}, [ layout, setAttributes, className ] );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="settings">
					<ToolsPanel
						label={ __( 'Settings' ) }
						resetAll={ () => {
							setAttributes( {
								moneScrollSnap: undefined,
								moneScrollSnapAlign: undefined,
							} );
							deleteClass(
								scrollClassName,
								className,
								setAttributes
							);
						} }
					>
						<ToolsPanelItem
							label={ __( 'Horizontal scrolling', 'mone' ) }
							isShownByDefault
							hasValue={ () =>
								existsClass( className, scrollClassName )
							}
							onDeselect={ () =>
								deleteClass(
									scrollClassName,
									className,
									setAttributes
								)
							}
						>
							<ToggleControl
								label={ __( 'Horizontal scrolling', 'mone' ) }
								checked={ existsClass(
									className,
									scrollClassName
								) }
								onChange={ () => {
									setClassName(
										scrollClassName,
										className,
										setAttributes
									);

									if ( layout?.type !== 'grid' ) {
										setAttributes( {
											layout: {
												...layout,
												type: 'grid',
											},
										} );
									}

									if ( moneScrollSnap === undefined ) {
										setAttributes( {
											moneScrollSnap: 'snap',
										} );
									}
								} }
								__nextHasNoMarginBottom
							/>
						</ToolsPanelItem>
						{ existsClass( className, scrollClassName ) && (
							<ToolsPanelItem
								label={ __( 'Scroll Snap', 'mone' ) }
								isShownByDefault
								hasValue={ () => !! moneScrollSnap }
								onDeselect={ () =>
									setAttributes( {
										moneScrollSnap: undefined,
									} )
								}
							>
								<ToggleControl
									label={ __( 'Scroll Snap', 'mone' ) }
									checked={
										moneScrollSnap === 'snap' ? true : false
									}
									onChange={ () => {
										setAttributes( {
											moneScrollSnap:
												moneScrollSnap === 'snap'
													? 'notSnap'
													: 'snap',
										} );
									} }
									__nextHasNoMarginBottom
								/>
							</ToolsPanelItem>
						) }
						{ existsClass( className, scrollClassName ) &&
							moneScrollSnap === 'snap' && (
								<ToolsPanelItem
									label={ __( 'Snap placement', 'mone' ) }
									isShownByDefault
									hasValue={ () => !! moneScrollSnapAlign }
									onDeselect={ () =>
										setAttributes( {
											moneScrollSnapAlign: undefined,
										} )
									}
								>
									<ToggleGroupControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										label={ __( 'Snap placement', 'mone' ) }
										value={
											moneScrollSnapAlign || 'center'
										}
										onChange={ ( value ) =>
											setAttributes( {
												moneScrollSnapAlign: value,
											} )
										}
									>
										<ToggleGroupControlOption
											label={
												<Icon icon={ justifyLeft } />
											}
											value="start"
										/>
										<ToggleGroupControlOption
											ddd
											label={
												<Icon icon={ justifyCenter } />
											}
											value="center"
										/>
										<ToggleGroupControlOption
											label={
												<Icon icon={ justifyRight } />
											}
											value="end"
										/>
									</ToggleGroupControl>
									{ columnCount % 2 === 0 &&
										( 'center' === moneScrollSnapAlign ||
											undefined ===
												moneScrollSnapAlign ) && (
											<Warning>
												{ __(
													'Recommend an odd number of columns for snap scrolling.',
													'mone'
												) }
											</Warning>
										) }
								</ToolsPanelItem>
							) }
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	}
);

/**
 * Override the default block element to include elements styles.
 */
const blockListBlockPostTemplate = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		const { name, attributes, wrapperProps } = props;
		if ( name !== 'core/post-template' ) {
			return <BlockListBlock { ...props } />;
		}
		const { style, layout, moneScrollSnap, moneScrollSnapAlign } =
			attributes;
		const gap =
			( style?.spacing?.blockGap &&
				getGapCSSValue( style?.spacing?.blockGap ) ) ||
			'1.2rem';
		const columnCount = layout?.columnCount || null;
		const minimumColumnWidth = layout?.minimumColumnWidth || null;

		const extraStyle = {
			'--mone--the--min--width':
				columnCount !== null
					? `calc(( 100% - (${
							layout?.columnCount - 1
					  } * ${ gap }) ) / ${ columnCount } )`
					: `${ minimumColumnWidth }`,
		};

		const blockWrapperProps = {
			...wrapperProps,
			className: clsx( wrapperProps?.className, {
				'mone-scroll-snap': moneScrollSnap === 'snap',
				[ `mone-scroll-snap-${ moneScrollSnapAlign }` ]:
					!! moneScrollSnapAlign,
			} ),
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
	'mone/blocks/register-block-type/post-template',
	registerBlockTypePostTemplate
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/post-template',
	blockEditPostTemplate
);

addFilter(
	'editor.BlockListBlock',
	'mone/editor/block-list-block/post-template',
	blockListBlockPostTemplate
);
