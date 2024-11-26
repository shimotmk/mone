/**
 * External dependencies
 */
import clsx from 'clsx';

import { __ } from '@wordpress/i18n';
import { InspectorControls, useSettings } from '@wordpress/block-editor';
import {
	PanelBody,
	BaseControl,
	SelectControl,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { View } from '@wordpress/primitives';

import './style.scss';
import './variations';

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

		const languageOption = [
			{ label: 'PHP', value: 'php' },
			{ label: 'Markup', value: 'markup' },
			{ label: 'CSS', value: 'css' },
			{ label: 'C-like', value: 'clike' },
			{ label: 'JavaScript', value: 'javascript' },
			{ label: 'JSON', value: 'json' },
			{ label: 'SQL', value: 'sql' },
		];

		const [ spacingUnits ] = useSettings( 'spacing.units' );
		const availableUnits = spacingUnits
			? spacingUnits.filter( ( unit ) => unit !== '%' )
			: [ 'px', 'em', 'rem', 'vw', 'vh' ];

		const units = useCustomUnits( {
			availableUnits,
			defaultValues: { px: 100, em: 10, rem: 10, vw: 10, vh: 25 },
		} );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Code Settings', 'mone' ) }
						initialOpen={ true }
					>
						<BaseControl __nextHasNoMarginBottom>
							<SelectControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={ __( 'Code Language', 'mone' ) }
								options={ languageOption }
								value={ moneLanguageName || '' }
								onChange={ ( value ) => {
									setAttributes( {
										moneLanguageName: value
											? value
											: undefined,
									} );
								} }
							/>
						</BaseControl>
						<View className="tools-panel-item-spacing">
							<UnitControl
								onChange={ ( value ) => {
									setAttributes( {
										moneHeight: value ? value : undefined,
									} );
								} }
								value={ moneHeight }
								units={ units }
								label={ __( 'Height', 'mone' ) }
								size="__unstable-large"
							/>
						</View>
					</PanelBody>
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
