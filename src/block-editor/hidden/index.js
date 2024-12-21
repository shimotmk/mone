import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import {
	__experimentalToolsPanel as ToolsPanel,
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
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

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
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Hide settings', 'mone' ) }
						resetAll={ () => {} }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							label={ __( 'Hide on PC', 'mone' ) }
							isShownByDefault={ false }
							hasValue={ () =>
								existsClass( className, 'mone-pc-none' )
							}
							onDeselect={ () => {
								deleteClass(
									'mone-pc-none',
									className,
									setAttributes
								);
							} }
							resetAllFilter={ () => {
								deleteClass(
									'mone-pc-none',
									className,
									setAttributes
								);
							} }
						>
							<ToggleControl
								label={ __( 'Hide on PC', 'mone' ) }
								checked={ existsClass(
									className,
									'mone-pc-none'
								) }
								onChange={ () =>
									setClassName(
										'mone-pc-none',
										className,
										setAttributes
									)
								}
								__nextHasNoMarginBottom
							/>
						</ToolsPanelItem>
						<ToolsPanelItem
							label={ __( 'Hide on mobile', 'mone' ) }
							isShownByDefault={ false }
							hasValue={ () =>
								existsClass( className, 'mone-sp-none' )
							}
							onDeselect={ () => {
								deleteClass(
									'mone-sp-none',
									className,
									setAttributes
								);
							} }
							resetAllFilter={ () => {
								deleteClass(
									'mone-sp-none',
									className,
									setAttributes
								);
							} }
						>
							<ToggleControl
								label={ __( 'Hide on mobile', 'mone' ) }
								checked={ existsClass(
									className,
									'mone-sp-none'
								) }
								onChange={ () =>
									setClassName(
										'mone-sp-none',
										className,
										setAttributes
									)
								}
								__nextHasNoMarginBottom
							/>
						</ToolsPanelItem>
					</ToolsPanel>
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
