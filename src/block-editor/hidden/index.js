import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { __experimentalToolsPanel as ToolsPanel } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';

import { deleteClass } from '../../utils-func/class-name/classAttribute.js';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

import { MediaQuery } from './media-query';

export const BlockEditHidden = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const {
			attributes: { className },
			setAttributes,
		} = props;
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Hide settings', 'mone' ) }
						dropdownMenuProps={ dropdownMenuProps }
						resetAll={ () => {
							deleteClass(
								[ 'mone-pc-none', 'mone-sp-none' ],
								className,
								setAttributes
							);
						} }
					>
						<MediaQuery { ...props } />
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
