import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import {
	ToolbarDropdownMenu,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { alignNone, stretchFullWidth, stretchWide } from '@wordpress/icons';

import './editor.scss';
import {
	toggleClass,
	deleteClass,
} from '../../../utils-func/class-name/classAttribute.js';
import {
	deleteClassName,
	existsClassName,
} from '../../../utils-func/class-name';
import { useToolsPanelDropdownMenuProps } from '../../../utils-func/use-tools-panel-dropdown';
import { arrowAutoFit } from '../../../icons';
import './format';

const BLOCK_ALIGNMENTS_CONTROLS = {
	none: {
		icon: alignNone,
		title: __( 'None', 'mone' ),
	},
	fit: {
		icon: arrowAutoFit,
		title: __( 'Fit contents', 'mone' ),
		className: 'mone-alignfit',
	},
	wide: {
		icon: stretchWide,
		title: __( 'Wide width', 'mone' ),
		className: 'alignwide',
	},
	full: {
		icon: stretchFullWidth,
		title: __( 'Full width', 'mone' ),
		className: 'alignfull',
	},
};

const dialogClassName = 'mone-dialog-content';
const ShowDialogEditClassName = 'mone-edit-show-dialog';

export const blockEditGroup = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		const { className, tagName } = attributes;

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
							label={ __(
								'Show dialog on click in editor',
								'mone'
							) }
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
								label={ __(
									'Show dialog on click in editor',
									'mone'
								) }
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
					<style>
						{ `
							.block-editor-block-variation-transforms {
								display: none;
							}
							
							.block-editor-block-inspector__tabs {
								.components-panel__body:not(.block-editor-block-inspector__advanced):nth-child(1) {
									display: none;
								}
							}

							.components-tools-panel.block-editor-block-inspector__mone-position {
								display: none;
							}

							/* HTML要素を非表示 */
							.block-editor-block-inspector__advanced {
								.components-base-control:nth-child(3) {
									display: none;
								}
							}

							/* ツールバーのリンク */
							.components-toolbar-button[name="link"] {
								display: none;
							}
						` }
					</style>
				</InspectorControls>
				<InspectorControls group="color">
					<style>
						{ `
							.block-editor-block-variation-transforms {
								display: none;
							}

							/* ツールバーのリンク */
							.components-toolbar-button[name="link"] {
								display: none;
							}
						` }
					</style>
				</InspectorControls>
				<BlockControls group="block">
					<ToolbarDropdownMenu
						icon={
							[
								{
									control: BLOCK_ALIGNMENTS_CONTROLS.fit,
									icon: arrowAutoFit,
								},
								{
									control: BLOCK_ALIGNMENTS_CONTROLS.wide,
									icon: stretchFullWidth,
								},
								{
									control: BLOCK_ALIGNMENTS_CONTROLS.full,
									icon: stretchWide,
								},
							].find( ( { control } ) =>
								existsClassName( control.className, className )
							)?.icon || alignNone
						}
						label={ __( 'Select width', 'mone' ) }
						controls={ Object.values(
							BLOCK_ALIGNMENTS_CONTROLS
						).map( ( control ) => ( {
							title: control.title,
							icon: control.icon,
							isActive: existsClassName(
								control.className,
								className
							),
							onClick: () => {
								const _className = deleteClassName(
									Object.values(
										BLOCK_ALIGNMENTS_CONTROLS
									).map( ( c ) => c.className ),
									className
								);
								toggleClass(
									control.className,
									_className,
									setAttributes
								);
							},
						} ) ) }
					/>
				</BlockControls>
			</>
		);
	}
);

/**
 * Override the default block element to include elements styles.
 */
const BlockListBlockGroup = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		const { name, attributes, wrapperProps, isSelected } = props;
		const { tagName, anchor } = attributes;
		if ( name !== 'core/group' ) {
			return <BlockListBlock { ...props } />;
		}
		if ( tagName !== 'dialog' ) {
			return <BlockListBlock { ...props } />;
		}

		const addWrapperProps = {
			...wrapperProps,
			className: clsx( wrapperProps?.className, anchor ),
			open: isSelected,
		};

		return (
			<>
				<BlockListBlock { ...props } wrapperProps={ addWrapperProps } />
			</>
		);
	}
);

addFilter(
	'editor.BlockListBlock',
	'mone/editor/block-list-block/group',
	BlockListBlockGroup
);

addFilter( 'editor.BlockEdit', 'mone/editor/block-edit/group', blockEditGroup );
