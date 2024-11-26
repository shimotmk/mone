import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';

import {
	setClassName,
	existsClass,
} from '../../utils-func/class-name/classAttribute.js';

export const BlockEditHidden = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const {
			name,
			attributes: { className },
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
				<InspectorControls>
					<PanelBody
						title={ __( 'Hide settings', 'mone' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __( 'Hide on PC', 'mone' ) }
							checked={ existsClass( className, 'mone-pc-none' ) }
							onChange={ () =>
								setClassName(
									'mone-pc-none',
									className,
									setAttributes
								)
							}
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={ __( 'Hide on mobile', 'mone' ) }
							checked={ existsClass( className, 'mone-sp-none' ) }
							onChange={ () =>
								setClassName(
									'mone-sp-none',
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
	}
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/hidden/with-inspector-controls',
	BlockEditHidden
);
