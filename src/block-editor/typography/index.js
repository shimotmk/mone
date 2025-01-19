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
	setClassName,
	existsClass,
	deleteClass,
} from '../../utils-func/class-name/classAttribute.js';
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
						label={ __( 'テキスト1行中央寄せ', 'mone' ) }
						isShownByDefault={ true }
						hasValue={ () =>
							existsClass( className, 'mone-one-line-center' )
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
										'テキスト1行中央寄せ',
										'mone'
									) }
									checked={ existsClass(
										className,
										'mone-one-line-center'
									) }
									onChange={ () =>
										setClassName(
											'mone-one-line-center',
											className,
											setAttributes
										)
									}
									__nextHasNoMarginBottom
								/>
							}
							message={ __(
								'テキストが2行以上になった場合は左寄せで文字を折り返します。',
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
