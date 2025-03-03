import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanel as ToolsPanel } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

import { PostIncludeControls } from './post-in';
import { useToolsPanelDropdownMenuProps } from '../../../utils-func/use-tools-panel-dropdown';

export const BlockEditQuery = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		if ( name !== 'core/query' ) {
			return <BlockEdit { ...props } />;
		}
		const { namespace } = attributes;
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();
		if (
			namespace === null ||
			namespace === undefined ||
			! namespace.startsWith( 'mone-' )
		) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					{ namespace === 'mone-post-in-query' && (
						<>
							<ToolsPanel
								label={ __( 'Include Posts', 'mone' ) }
								resetAll={ () => {
									setAttributes( {
										query: {
											...attributes.query,
											include_posts: [],
										},
									} );
								} }
								dropdownMenuProps={ dropdownMenuProps }
							>
								<PostIncludeControls
									attributes={ attributes }
									setAttributes={ setAttributes }
								/>
							</ToolsPanel>
						</>
					) }
				</InspectorControls>
			</>
		);
	}
);

addFilter( 'editor.BlockEdit', 'mone/editor/block-edit/query', BlockEditQuery );
