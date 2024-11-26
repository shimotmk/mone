import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, BaseControl } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

import { PostIncludeControls } from './post-in';

export const BlockEditQuery = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		if ( name !== 'core/query' ) {
			return <BlockEdit { ...props } />;
		}
		const { namespace } = attributes;
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
							<PanelBody
								title={ __( 'Include Posts', 'mone' ) }
								initialOpen={ true }
							>
								<BaseControl __nextHasNoMarginBottom>
									<PostIncludeControls
										attributes={ attributes }
										setAttributes={ setAttributes }
									/>
								</BaseControl>
							</PanelBody>
						</>
					) }
				</InspectorControls>
			</>
		);
	}
);

addFilter( 'editor.BlockEdit', 'mone/editor/block-edit/query', BlockEditQuery );
