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

export function registerBlockTypePostTemplate( settings, name ) {
	if ( name !== 'core/post-template' ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		moneScroll: {
			type: 'string',
		},
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
		const { layout, moneScroll, moneScrollSnap, moneScrollSnapAlign } =
			attributes;
		const columnCount = layout?.columnCount || null;

		useEffect( () => {
			if ( layout?.type !== 'grid' ) {
				setAttributes( {
					moneScroll: undefined,
					moneScrollSnap: undefined,
					moneScrollSnapAlign: undefined,
				} );
			}
		}, [ layout, setAttributes ] );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="settings">
					<ToolsPanel
						label={ __( 'Settings' ) }
						resetAll={ () =>
							setAttributes( {
								moneScroll: undefined,
								moneScrollSnap: undefined,
								moneScrollSnapAlign: undefined,
							} )
						}
					>
						<ToolsPanelItem
							label={ __( '横スクロール', 'mone' ) }
							isShownByDefault
							hasValue={ () => !! moneScroll }
							onDeselect={ () =>
								setAttributes( {
									moneScroll: undefined,
								} )
							}
						>
							<ToggleControl
								label={ __( '横スクロール', 'mone' ) }
								checked={
									moneScroll === 'horizon' ? true : false
								}
								onChange={ () => {
									setAttributes( {
										moneScroll:
											moneScroll === 'horizon'
												? undefined
												: 'horizon',
									} );

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
						{ moneScroll === 'horizon' && (
							<ToolsPanelItem
								label={ __( 'スクロールスナップ', 'mone' ) }
								isShownByDefault
								hasValue={ () => !! moneScrollSnap }
								onDeselect={ () =>
									setAttributes( {
										moneScrollSnap: undefined,
									} )
								}
							>
								<ToggleControl
									label={ __( 'スクロールスナップ', 'mone' ) }
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
						{ moneScrollSnap === 'snap' && (
							<ToolsPanelItem
								label={ __( 'スナップ配置', 'mone' ) }
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
									label={ __( 'スナップ配置', 'mone' ) }
									value={ moneScrollSnapAlign || 'center' }
									onChange={ ( value ) =>
										setAttributes( {
											moneScrollSnapAlign: value,
										} )
									}
								>
									<ToggleGroupControlOption
										label={ <Icon icon={ justifyLeft } /> }
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
										label={ <Icon icon={ justifyRight } /> }
										value="end"
									/>
								</ToggleGroupControl>
								{ columnCount % 2 === 0 &&
									'center' === moneScrollSnapAlign && (
										<Warning>
											{ __(
												'スナップスクロールのカラム数は奇数がおすすめです。',
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
		const {
			style,
			layout,
			moneScroll,
			moneScrollSnap,
			moneScrollSnapAlign,
		} = attributes;
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
				'mone-scroll': moneScroll === 'horizon',
				'mone-scroll-snap': moneScrollSnap === 'snap',
				'mone-scroll-no-snap': moneScrollSnap === 'noSnap',
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
