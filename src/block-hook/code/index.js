/**
 * External dependencies
 */
import clsx from 'clsx';

import { __ } from '@wordpress/i18n';
import { InspectorControls, HeightControl } from '@wordpress/block-editor';
import {
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import './style.scss';
import './variations';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

export function registerBlockTypeCode( settings, name ) {
	if ( name !== 'core/code' ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		moneLanguageName: {
			type: 'string',
		},
		moneHeight: {
			type: 'string',
		},
	};

	settings.supports = {
		...settings.supports,
		color: {
			text: false,
			background: false,
		},
		typography: {
			fontSize: true,
		},
	};

	return settings;
}

export const blockEditCode = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		if ( name !== 'core/code' ) {
			return <BlockEdit { ...props } />;
		}
		const { moneLanguageName, moneHeight } = attributes;
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		const languageOption = [
			{ label: 'PHP', value: 'php' },
			{ label: 'Markup', value: 'markup' },
			{ label: 'CSS', value: 'css' },
			{ label: 'C-like', value: 'clike' },
			{ label: 'JavaScript', value: 'javascript' },
			{ label: 'JSON', value: 'json' },
			{ label: 'SQL', value: 'sql' },
		];

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Code Settings', 'mone' ) }
						resetAll={ () => {
							setAttributes( {
								moneLanguageName: undefined,
								moneHeight: undefined,
							} );
						} }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							label={ __( 'Code Language', 'mone' ) }
							isShownByDefault
							hasValue={ () => !! moneLanguageName }
							onDeselect={ () =>
								setAttributes( {
									moneLanguageName: undefined,
								} )
							}
						>
							<SelectControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={ __( 'Code Language', 'mone' ) }
								options={ languageOption }
								value={ moneLanguageName || 'markup' }
								onChange={ ( value ) => {
									setAttributes( {
										moneLanguageName: value
											? value
											: undefined,
									} );
								} }
							/>
						</ToolsPanelItem>
						<ToolsPanelItem
							label={ __( 'Height', 'mone' ) }
							isShownByDefault
							hasValue={ () => !! moneHeight }
							onDeselect={ () =>
								setAttributes( {
									moneHeight: undefined,
								} )
							}
						>
							<HeightControl
								label={ __( 'Height', 'mone' ) }
								value={ moneHeight || '' }
								onChange={ ( value ) => {
									setAttributes( {
										moneHeight: value,
									} );
								} }
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	}
);

/**
 * Override the default block element to include elements styles.
 */
const blockListBlockCode = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		const { name, attributes, wrapperProps } = props;
		if ( name !== 'core/code' ) {
			return <BlockListBlock { ...props } />;
		}
		const { moneHeight } = attributes;
		const extraStyle = {
			height: moneHeight || undefined,
		};

		const blockWrapperProps = {
			...wrapperProps,
			className: clsx( wrapperProps?.className, 'language-' ),
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
	'mone/blocks/register-block-type/code',
	registerBlockTypeCode
);

addFilter( 'editor.BlockEdit', 'mone/editor/block-edit/code', blockEditCode );

addFilter(
	'editor.BlockListBlock',
	'mone/editor/block-list-block/code',
	blockListBlockCode
);
