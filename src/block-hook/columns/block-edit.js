/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';

import {
	toggleClass,
	deleteClass,
} from '../../utils-func/class-name/classAttribute.js';
import { existsClassName } from '../../utils-func/class-name';

/**
 * Override the default edit UI to include layout controls
 */
export const withInspectorControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		if ( name !== 'core/columns' ) {
			return <BlockEdit { ...props } />;
		}

		const { isStackedOnMobile, className } = attributes;
		const flexWrapReverseClassName = 'mone_flex-wrap-reverse-on-mobile';

		useEffect( () => {
			if ( ! isStackedOnMobile ) {
				deleteClass(
					flexWrapReverseClassName,
					className,
					setAttributes
				);
			}
		}, [ isStackedOnMobile, className, setAttributes ] );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody>
						<ToggleControl
							label={ __( 'Fold backwards on mobile', 'mone' ) }
							disabled={ ! isStackedOnMobile }
							checked={ existsClassName(
								flexWrapReverseClassName,
								className
							) }
							onChange={ () =>
								toggleClass(
									flexWrapReverseClassName,
									className,
									setAttributes
								)
							}
							__nextHasNoMarginBottom
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	},
	'withInspectorControls'
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/core-columns/with-inspector-controls',
	withInspectorControls,
	1
);
