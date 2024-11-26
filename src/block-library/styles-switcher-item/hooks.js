import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, BaseControl, SelectControl } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { dispatch, useSelect } from '@wordpress/data';

export const BlockEditStyleSwitcherItem = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, clientId } = props;
		if ( name !== 'core/buttons' && name !== 'core/button' ) {
			return <BlockEdit { ...props } />;
		}
		const {
			isParentSwitcherItem,
			parentSwitcherItemClientId,
			styleVariations,
		} = useSelect(
			( select ) => {
				const {
					getBlockNamesByClientId,
					getBlockParents,
					getBlockAttributes,
				} = select( blockEditorStore );
				const parentIds = getBlockParents( clientId ) || [];
				const parentBlockNames = getBlockNamesByClientId( parentIds );
				const _isParentSwitcherItem = parentBlockNames.some(
					( blockName ) => blockName === 'mone/styles-switcher-item'
				);
				const _parentSwitcherItemClientId = parentIds.find(
					( id ) =>
						getBlockNamesByClientId( [ id ] )[ 0 ] ===
						'mone/styles-switcher-item'
				);
				const _styleVariations = getBlockAttributes(
					_parentSwitcherItemClientId
				)?.styleVariations;
				return {
					isParentSwitcherItem: _isParentSwitcherItem,
					parentSwitcherItemClientId: _parentSwitcherItemClientId,
					styleVariations: _styleVariations,
				};
			},
			[ clientId ]
		);

		if ( ! isParentSwitcherItem && ! parentSwitcherItemClientId ) {
			return <BlockEdit { ...props } />;
		}

		const VariationOption = [
			{ label: __( 'Current', 'mone' ), value: '' },
			{ label: __( 'Mone Default', 'mone' ), value: 'default' },
			{ label: __( 'Blue', 'mone' ), value: 'blue' },
			{ label: __( 'Dark', 'mone' ), value: 'dark' },
			{ label: __( 'Green', 'mone' ), value: 'green' },
			{ label: __( 'White', 'mone' ), value: 'white' },
		];

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Settings', 'mone' ) }
						initialOpen={ true }
					>
						<BaseControl __nextHasNoMarginBottom>
							<SelectControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={ __(
									'Style variation settings',
									'mone'
								) }
								options={ VariationOption }
								value={ styleVariations }
								onChange={ ( value ) => {
									dispatch(
										blockEditorStore
									).updateBlockAttributes(
										parentSwitcherItemClientId,
										{
											styleVariations: value,
										}
									);
								} }
							/>
						</BaseControl>
					</PanelBody>
				</InspectorControls>
			</>
		);
	}
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/style-switcher-item',
	BlockEditStyleSwitcherItem
);
