import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';

import {
	toggleClass,
	deleteClass,
} from '../../utils-func/class-name/classAttribute.js';
import { existsClassName } from '../../utils-func/class-name';
import { InfoPopoverLabel } from '../../components/info-popover-label';

export const BlockEditTypography = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const {
			name,
			attributes: { className },
			setAttributes,
			clientId,
		} = props;

		const hasSupportCustomClassName = hasBlockSupport(
			name,
			'customClassName',
			true
		);
		if ( ! hasSupportCustomClassName ) {
			return <BlockEdit { ...props } />;
		}

		const targetBlocks = [ 'core/paragraph', 'core/heading' ];
		if ( ! targetBlocks.includes( name ) ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="typography">
					<ToolsPanelItem
						label={ __( 'One line text center', 'mone' ) }
						isShownByDefault={ true }
						hasValue={ () =>
							existsClassName( 'mone-one-line-center', className )
						}
						onDeselect={ () => {
							deleteClass(
								'mone-one-line-center',
								className,
								setAttributes
							);
						} }
						resetAllFilter={ () => {
							deleteClass(
								'mone-one-line-center',
								className,
								setAttributes
							);
						} }
						panelId={ clientId }
					>
						<InfoPopoverLabel
							className="mone-gradient-popover-color-picker-title"
							label={
								<ToggleControl
									label={ __(
										'One line text center',
										'mone'
									) }
									checked={ existsClassName(
										'mone-one-line-center',
										className
									) }
									onChange={ () => {
										toggleClass(
											'mone-one-line-center',
											className,
											setAttributes
										);
										setAttributes( {
											align: undefined,
											textAlign: undefined,
										} );
									} }
									__nextHasNoMarginBottom
								/>
							}
							message={ __(
								'When there is one line of text, it is centered, and when there is two or more lines of text, it is left-justified and the text wraps.',
								'mone'
							) }
							popoverProps={ {
								position: undefined,
								placement: 'bottom-end',
							} }
						/>
					</ToolsPanelItem>
				</InspectorControls>
			</>
		);
	}
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/typography/with-inspector-controls',
	BlockEditTypography
);
