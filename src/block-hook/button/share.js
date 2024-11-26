import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, BaseControl, SelectControl } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';

export function registerBlockTypeButton( settings, name ) {
	if ( name !== 'core/button' ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		moneShareProviderNameSlug: {
			type: 'string',
		},
	};

	return settings;
}

export const BlockEditButton = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes, clientId } = props;
		if ( name !== 'core/button' ) {
			return <BlockEdit { ...props } />;
		}
		const { moneShareProviderNameSlug } = attributes;

		const { isParentCoreGroup, patternName } = useSelect(
			( select ) => {
				const {
					getBlockNamesByClientId,
					getBlockParents,
					getBlockAttributes,
				} = select( blockEditorStore );
				const parentIds = getBlockParents( clientId ) || [];
				const _parentCoreGroupClientId = parentIds.find(
					( id ) =>
						getBlockNamesByClientId( [ id ] )[ 0 ] === 'core/group'
				);
				const _patternName = getBlockAttributes(
					_parentCoreGroupClientId
				)?.metadata?.patternName;

				return {
					isParentCoreGroup: !! _parentCoreGroupClientId,
					patternName: _patternName,
				};
			},
			[ clientId ]
		);

		if ( ! isParentCoreGroup || 'mone/sns-share' !== patternName ) {
			return <BlockEdit { ...props } />;
		}

		const ProviderOption = [
			{ label: __( 'None', 'mone' ), value: '' },
			{ label: __( 'Facebook', 'mone' ), value: 'facebook' },
			{ label: __( 'X', 'mone' ), value: 'x' },
			{ label: __( 'Hatena', 'mone' ), value: 'hatena' },
			{ label: __( 'Pocket', 'mone' ), value: 'getpocket' },
			{ label: __( 'LINE', 'mone' ), value: 'line' },
			{ label: __( 'Copy', 'mone' ), value: 'copy' },
		];

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Share Settings', 'mone' ) }
						initialOpen={ true }
					>
						<BaseControl __nextHasNoMarginBottom>
							<SelectControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={ __( 'Share Button Provider', 'mone' ) }
								options={ ProviderOption }
								value={ moneShareProviderNameSlug || '' }
								onChange={ ( value ) => {
									setAttributes( {
										moneShareProviderNameSlug: value
											? value
											: undefined,
										tagName: value ? 'button' : undefined,
									} );
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
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/share-button',
	registerBlockTypeButton
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/share-button',
	BlockEditButton
);
