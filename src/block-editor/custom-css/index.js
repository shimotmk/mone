/**
 * External dependencies
 */
import clsx from 'clsx';

import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { TextareaControl, BaseControl } from '@wordpress/components';
import { createHigherOrderComponent, useInstanceId } from '@wordpress/compose';
import {
	InspectorControls,
	transformStyles,
	__unstableEditorStyles as EditorStyles,
} from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';

export function registerBlockTypeCustomCss( settings, name ) {
	const hasSupportCustomClassName = hasBlockSupport(
		name,
		'customClassName',
		true
	);
	if ( ! hasSupportCustomClassName ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		moneCustomCss: {
			type: 'string',
		},
	};

	return settings;
}

export const BlockEditCustomCss = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const {
			name,
			attributes: { moneCustomCss },
			setAttributes,
		} = props;
		const hasSupportCustomClassName = hasBlockSupport(
			name,
			'customClassName',
			true
		);
		if ( ! hasSupportCustomClassName ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="advanced">
					<BaseControl
						__nextHasNoMarginBottom
						help={ __(
							'Using the selector, it can be rewritten to a block-specific class.',
							'mone'
						) }
					>
						<TextareaControl
							label={ __( 'Additional CSS', 'mone' ) }
							__nextHasNoMarginBottom
							value={ moneCustomCss }
							onChange={ ( newValue ) =>
								setAttributes( { moneCustomCss: newValue } )
							}
							className="block-editor-global-styles-advanced-panel__custom-css-input"
						/>
					</BaseControl>
				</InspectorControls>
			</>
		);
	}
);

/**
 * Override the default block element to include elements styles.
 */
const BlockListBlockCustomCss = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		const { name, attributes, wrapperProps } = props;
		const hasSupportCustomClassName = hasBlockSupport(
			name,
			'customClassName',
			true
		);
		if ( ! hasSupportCustomClassName ) {
			return <BlockListBlock { ...props } />;
		}

		const id = useInstanceId( BlockListBlock );
		const uniqueClass = `mone_custom_css_${ id }`;
		const { moneCustomCss } = attributes;

		if ( ! moneCustomCss ) {
			return <BlockListBlock { ...props } />;
		}

		// selectorをUniqueクラスに変換する
		let cssTag = moneCustomCss ? moneCustomCss : '';
		if ( cssTag && uniqueClass ) {
			cssTag = moneCustomCss.replace( /selector/g, '.' + uniqueClass );
		}

		// cssに.editor-styles-wrapperをwrapする
		if ( cssTag !== '' ) {
			cssTag = transformStyles(
				[ { css: cssTag } ],
				'.editor-styles-wrapper'
			);
		}

		const editorStyles = [
			{
				css: cssTag,
			},
		];

		const addWrapperProps = {
			...wrapperProps,
			className: clsx( wrapperProps?.className, uniqueClass ),
		};

		return (
			<>
				<BlockListBlock { ...props } wrapperProps={ addWrapperProps } />
				<EditorStyles styles={ editorStyles } />
			</>
		);
	}
);

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/custom-css',
	registerBlockTypeCustomCss
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/custom-css',
	BlockEditCustomCss
);
addFilter(
	'editor.BlockListBlock',
	'mone/editor/block-list-block/custom-css',
	BlockListBlockCustomCss
);
