import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
} from '@wordpress/components';
import {
	InspectorControls,
	__experimentalSpacingSizesControl as SpacingSizesControl,
} from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { getBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';

import { BlockEditGap } from './gap';

const hasSpacingSupport = ( blockNameOrType ) => {
	const moneSupport = getBlockSupport( blockNameOrType, 'moneSatori' );
	const spacingSupport = moneSupport?.spacing || false;
	return spacingSupport && spacingSupport.padding === true;
};

export const BlockEditSatori = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;

		if ( ! hasSpacingSupport( name ) ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<ToolsPanel label={ __( 'Dimensions' ) }>
						<ToolsPanelItem
							hasValue={ () => !! attributes.moneStyle?.padding }
							label={ __( 'Padding' ) }
							onDeselect={ () =>
								setAttributes( {
									moneStyle: {
										...attributes.moneStyle,
										padding: '',
									},
								} )
							}
							isShownByDefault={ true }
						>
							<SpacingSizesControl
								values={ attributes.moneStyle?.padding }
								onChange={ ( value ) =>
									setAttributes( {
										moneStyle: {
											...attributes.moneStyle,
											padding: value,
										},
									} )
								}
								label={ __( 'Padding' ) }
								sides={ [ 'top', 'right', 'bottom', 'left' ] }
								allowReset={ false }
								splitOnAxis={ true }
								showSideInLabel={ false }
							/>
						</ToolsPanelItem>
						<BlockEditGap { ...props } />
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	}
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/satori/supports-padding',
	BlockEditSatori
);
