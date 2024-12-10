/**
 * WordPress dependencies
 */
import { getBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { __experimentalSpacingSizesControl as SpacingSizesControl } from '@wordpress/block-editor';

const hasGapSupport = ( blockNameOrType ) => {
	const moneSupport = getBlockSupport( blockNameOrType, 'moneSatori' );
	const gapSupport = moneSupport?.blockGap || false;
	return gapSupport;
};

export const BlockEditGap = ( props ) => {
	const { name, attributes, setAttributes } = props;

	if ( ! hasGapSupport( name ) ) {
		return null;
	}

	const handleOnChange = ( value ) => {
		setAttributes( {
			moneStyle: {
				...attributes.moneStyle,
				blockGap: value,
			},
		} );
	};

	return (
		<>
			<ToolsPanelItem
				hasValue={ () => !! attributes?.moneStyle?.blockGap }
				label={ __( 'Block spacing' ) }
				onDeselect={ () => {
					setAttributes( {
						moneStyle: {
							...attributes.moneStyle,
							blockGap: '',
						},
					} );
				} }
				isShownByDefault={ true }
			>
				<SpacingSizesControl
					values={ attributes?.moneStyle?.blockGap }
					onChange={ handleOnChange }
					label={ __( 'Block spacing' ) }
					sides={ [ 'all' ] }
					allowReset={ false }
					splitOnAxis={ true }
					showSideInLabel={ false }
				/>
			</ToolsPanelItem>
		</>
	);
};
