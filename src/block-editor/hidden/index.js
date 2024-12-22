import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { __experimentalToolsPanel as ToolsPanel } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';

import { deleteRegExClass } from '../../utils-func/class-name/classAttribute.js';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

import { PostType } from './post-type';
import { MediaQuery } from './media-query';
import { Toc } from './table-of-contents';

export const BlockEditHidden = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const {
			name,
			attributes: { className },
			setAttributes,
		} = props;
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

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
					<ToolsPanel
						label={ __( 'Hide settings', 'mone' ) }
						dropdownMenuProps={ dropdownMenuProps }
						resetAll={ () => {
							deleteRegExClass(
								/^mone-.*-none$/,
								className,
								setAttributes
							);
						} }
					>
						<MediaQuery { ...props } />
						<PostType { ...props } />
						<Toc { ...props } />
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
