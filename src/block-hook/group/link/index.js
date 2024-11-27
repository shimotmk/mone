/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import {
	BlockControls,
	__experimentalLinkControl as LinkControl,
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	store as blockEditorStore,
	getColorObjectByAttributeValues,
	getColorObjectByColorValue,
} from '@wordpress/block-editor';
import { ToolbarButton, Popover } from '@wordpress/components';
import { link } from '@wordpress/icons';
import { useState, useCallback, useEffect } from '@wordpress/element';
import { select } from '@wordpress/data';

import './style.scss';

/**
 * Add the attributes needed for linked groups.
 * @param {Object} settings
 */
function addAttributes( settings ) {
	if ( 'core/group' !== settings.name ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		href: {
			type: 'string',
		},
		linkTarget: {
			type: 'string',
		},
		nofollow: {
			type: 'string',
		},
		moneHoverBackgroundColor: {
			type: 'string',
		},
	};

	return settings;
}

const LINK_SETTINGS = [
	...LinkControl.DEFAULT_LINK_SETTINGS,
	{
		id: 'nofollow',
		title: __( 'Mark as nofollow', 'mone' ),
	},
];

export const colorSlugToColorCode = ( color ) => {
	let colorCode;
	if ( color ) {
		const colorSet = select( blockEditorStore ).getSettings().colors;
		const ColorValue = getColorObjectByAttributeValues( colorSet, color );
		if ( ColorValue.color !== undefined ) {
			colorCode = ColorValue.color;
		} else {
			colorCode = color;
		}
	}
	return colorCode;
};

/**
 * Filter the BlockEdit object and add linked group inspector controls.
 * @param {Object} BlockEdit
 */
function addInspectorControls( BlockEdit ) {
	return ( props ) => {
		if ( props.name !== 'core/group' ) {
			return <BlockEdit { ...props } />;
		}

		const [ isEditingURL, setIsEditingURL ] = useState( false );
		const [ popoverAnchor, setPopoverAnchor ] = useState( null );
		const { attributes, setAttributes, clientId } = props;
		const { href, nofollow, linkTarget, moneHoverBackgroundColor } =
			attributes;

		const colorGradientSettings = useMultipleOriginColorsAndGradients();

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
			return () =>
				document.body.removeEventListener( 'click', popoverClose );
		}, [ popoverClose ] );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="color">
					{ href && (
						<ColorGradientSettingsDropdown
							__experimentalIsRenderedInSidebar
							settings={ [
								{
									colorValue: colorSlugToColorCode(
										moneHoverBackgroundColor
									),
									label: __( 'Hover Background', 'mone' ),
									onColorChange: ( newValue ) => {
										const colorSet =
											select(
												blockEditorStore
											).getSettings().colors;
										const ColorValue =
											getColorObjectByColorValue(
												colorSet,
												newValue
											);

										if ( ColorValue !== undefined ) {
											setAttributes( {
												moneHoverBackgroundColor:
													ColorValue.slug,
											} );
										} else {
											setAttributes( {
												moneHoverBackgroundColor:
													newValue,
											} );
										}
									},
									resetAllFilter: () => {
										setAttributes( {
											moneHoverBackgroundColor: undefined,
										} );
									},
									isShownByDefault: false,
									enableAlpha: true,
								},
							] }
							panelId={ clientId }
							{ ...colorGradientSettings }
						/>
					) }
				</InspectorControls>
				<BlockControls group="block">
					<ToolbarButton
						ref={ setPopoverAnchor }
						name="link"
						icon={ link }
						title={ __( 'Link', 'mone' ) }
						onClick={ () => setIsEditingURL( true ) }
						isActive={ !! href || isEditingURL }
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
									url: href,
									opensInNewTab: linkTarget === '_blank',
									nofollow,
								} }
								onChange={ ( {
									url: newURL = '',
									opensInNewTab,
									nofollow: newNofollow,
								} ) => {
									setAttributes( {
										href: newURL,
										linkTarget: opensInNewTab
											? '_blank'
											: undefined,
										nofollow: newNofollow,
										moneHoverBackgroundColor:
											moneHoverBackgroundColor
												? moneHoverBackgroundColor
												: 'main-bg',
									} );
								} }
								onRemove={ () => {
									setAttributes( {
										href: undefined,
										linkTarget: undefined,
										nofollow: undefined,
										// ホバー背景もリセット
										moneHoverBackgroundColor: undefined,
									} );
									setIsEditingURL( false );
								} }
								settings={ LINK_SETTINGS }
							/>
						</Popover>
					) }
				</BlockControls>
			</>
		);
	};
}

const isHexColor = ( color ) =>
	typeof color === 'string' && color.startsWith( '#' );

/**
 * Add linked group classes in the Editor.
 *
 * @param {Object} BlockListBlock
 */
function addClasses( BlockListBlock ) {
	return ( props ) => {
		const { name, attributes, wrapperProps } = props;

		if ( 'core/group' !== name ) {
			return <BlockListBlock { ...props } />;
		}
		const { href, moneHoverBackgroundColor } = attributes;

		const classes = clsx( props?.className, {
			'mone-is-linked': href,
		} );

		const addWrapperProps = {
			...wrapperProps,
			className: clsx( wrapperProps?.className, classes ),
			style: {
				...wrapperProps?.style,
				'--mone--hover-background-color': isHexColor(
					moneHoverBackgroundColor
				)
					? moneHoverBackgroundColor
					: `var(--wp--preset--color--${ moneHoverBackgroundColor })` ||
					  undefined,
			},
		};

		return <BlockListBlock { ...props } wrapperProps={ addWrapperProps } />;
	};
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/group/link',
	addAttributes
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/group/link-controls',
	addInspectorControls
);

addFilter(
	'editor.BlockListBlock',
	'mone/editor/block-list-block/group/link-classes',
	addClasses
);
