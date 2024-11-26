/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';

import {
	setClassName,
	existsClass,
} from '../../utils-func/class-name/classAttribute.js';

/**
 * Override the default edit UI to include layout controls
 */
export const withInspectorControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		if ( name !== 'core/group' ) {
			return <BlockEdit { ...props } />;
		}

		const { className, layout } = attributes;
		const wrapOnMobileClassName = 'mone_wrap-on-mobile';

		if ( layout?.type !== 'grid' ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody>
						<ToggleControl
							label={ __( 'Vertical layout on mobile', 'mone' ) }
							checked={ existsClass(
								className,
								wrapOnMobileClassName
							) }
							onChange={ () =>
								setClassName(
									wrapOnMobileClassName,
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
	'mone/editor/group/wrap-on-mobile/with-inspector-controls',
	withInspectorControls
);
