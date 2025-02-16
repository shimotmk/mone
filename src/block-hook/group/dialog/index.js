import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import {
	BlockControls,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	ToolbarDropdownMenu,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { alignNone, stretchFullWidth, stretchWide } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';

import './editor.scss';
import {
	toggleClass,
	addClass,
	deleteClass,
} from '../../../utils-func/class-name/classAttribute.js';
import {
	deleteClassName,
	existsClassName,
} from '../../../utils-func/class-name';
import { useToolsPanelDropdownMenuProps } from '../../../utils-func/use-tools-panel-dropdown';
import './format';

const BLOCK_ALIGNMENTS_CONTROLS = {
	none: {
		icon: alignNone,
		title: _x( 'None', 'Alignment option' ),
	},
	wide: {
		icon: stretchWide,
		title: __( 'Wide width' ),
		className: 'alignwide',
	},
	full: {
		icon: stretchFullWidth,
		title: __( 'Full width' ),
		className: 'alignfull',
	},
};

const dialogClassName = 'mone-dialog-content';
const ShowDialogEditClassName = 'mone-edit-show-dialog';

export function registerBlockTypeGruop( settings, name ) {
	if ( name !== 'core/group' ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
	};

	return settings;
}

export const blockEditGruop = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		const { align, className, tagName } = attributes;

		if ( name !== 'core/group' ) {
			return <BlockEdit { ...props } />;
		}
		if ( tagName !== 'dialog' ) {
			return <BlockEdit { ...props } />;
		}
		if ( ! existsClassName( dialogClassName, className ) ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="settings">
					<ToolsPanel
						label={ __( 'Dialog settings', 'mone' ) }
						dropdownMenuProps={ useToolsPanelDropdownMenuProps() }
						resetAll={ () => {
							deleteClass(
								ShowDialogEditClassName,
								className,
								setAttributes
							);
						} }
					>
						<ToolsPanelItem
							label={ __( 'Show dialog in editor', 'mone' ) }
							isShownByDefault={ true }
							hasValue={ () =>
								existsClassName(
									ShowDialogEditClassName,
									className
								)
							}
							onDeselect={ () => {
								deleteClass(
									ShowDialogEditClassName,
									className,
									setAttributes
								);
							} }
							resetAllFilter={ () => {
								deleteClass(
									ShowDialogEditClassName,
									className,
									setAttributes
								);
							} }
						>
							<ToggleControl
								label={ __( 'Show dialog in editor', 'mone' ) }
								checked={ existsClassName(
									ShowDialogEditClassName,
									className
								) }
								onChange={ () =>
									toggleClass(
										ShowDialogEditClassName,
										className,
										setAttributes
									)
								}
								__nextHasNoMarginBottom
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
				<InspectorControls group="mone-position"></InspectorControls>
				<InspectorControls group="position"></InspectorControls>
				<BlockControls group="block">
					<ToolbarDropdownMenu
						icon={
							BLOCK_ALIGNMENTS_CONTROLS[ align || 'none' ].icon ||
							alignNone
						}
						label="Select a direction"
						controls={ [
							{
								title: 'none',
								icon: alignNone,
								onClick: () => {
									setAttributes( {
										align: undefined,
									} );
									deleteClass(
										[
											BLOCK_ALIGNMENTS_CONTROLS.wide
												.className,
											BLOCK_ALIGNMENTS_CONTROLS.full
												.className,
										],
										className,
										setAttributes
									);
								},
							},
							{
								title: 'wide',
								icon: stretchFullWidth,
								isActive: existsClassName(
									BLOCK_ALIGNMENTS_CONTROLS.wide.className,
									className
								),
								onClick: () => {
									setAttributes( {
										align: 'wide',
									} );
									let _className = className;
									deleteClass(
										BLOCK_ALIGNMENTS_CONTROLS.full
											.className,
										className,
										setAttributes
									);
									_className = deleteClassName(
										[
											BLOCK_ALIGNMENTS_CONTROLS.wide
												.className,
											BLOCK_ALIGNMENTS_CONTROLS.full
												.className,
										],
										_className
									);
									addClass(
										BLOCK_ALIGNMENTS_CONTROLS.wide
											.className,
										_className,
										setAttributes
									);
								},
							},
							{
								title: 'full',
								icon: stretchWide,
								isActive: existsClassName(
									BLOCK_ALIGNMENTS_CONTROLS.full.className,
									className
								),
								onClick: () => {
									let _className = className;
									deleteClass(
										BLOCK_ALIGNMENTS_CONTROLS.full
											.className,
										className,
										setAttributes
									);
									_className = deleteClassName(
										[
											BLOCK_ALIGNMENTS_CONTROLS.wide
												.className,
											BLOCK_ALIGNMENTS_CONTROLS.full
												.className,
										],
										_className
									);
									addClass(
										BLOCK_ALIGNMENTS_CONTROLS.full
											.className,
										_className,
										setAttributes
									);
								},
							},
						] }
					/>
				</BlockControls>
			</>
		);
	}
);

/**
 * Override the default block element to include elements styles.
 */
const blockListBlockGruop = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		const { name, attributes, wrapperProps, clientId } = props;
		if ( name !== 'core/group' ) {
			return <BlockListBlock { ...props } />;
		}
		const { tagName, className, anchor } = attributes;
		if ( tagName !== 'dialog' ) {
			return <BlockListBlock { ...props } />;
		}
		if ( ! existsClassName( dialogClassName, className ) ) {
			return <BlockListBlock { ...props } />;
		}

		const blockWrapperProps = {
			...wrapperProps,
			className: clsx( wrapperProps?.className ),
			style: {
				...( wrapperProps && { ...wrapperProps.style } ),
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
	'mone/blocks/register-block-type/group',
	registerBlockTypeGruop
);

addFilter( 'editor.BlockEdit', 'mone/editor/block-edit/group', blockEditGruop );

addFilter(
	'editor.BlockListBlock',
	'mone/editor/block-list-block/group',
	blockListBlockGruop
);
