/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import {
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

export function registerBlockTypePostDate( settings, name ) {
	if ( name !== 'core/post-date' ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		monePrefix: {
			type: 'string',
		},
		moneSuffix: {
			type: 'string',
		},
	};

	return settings;
}

export const blockEditPostDate = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		if ( name !== 'core/post-date' ) {
			return <BlockEdit { ...props } />;
		}
		const { monePrefix, moneSuffix } = attributes;
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Mone prefix suffix', 'mone' ) }
						resetAll={ () => {
							setAttributes( {
								monePrefix: undefined,
								moneSuffix: undefined,
							} );
						} }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							label={ __( 'Prefix' ) }
							isShownByDefault
							hasValue={ () => !! monePrefix }
							onDeselect={ () =>
								setAttributes( {
									monePrefix: undefined,
								} )
							}
						>
							<TextControl
								label={ __( 'Prefix' ) }
								value={ monePrefix || '' }
								onChange={ ( value ) =>
									setAttributes( { monePrefix: value } )
								}
								placeholder={ __( 'Prefix' ) }
								__nextHasNoMarginBottom
							/>
						</ToolsPanelItem>
						<ToolsPanelItem
							label={ __( 'Suffix' ) }
							isShownByDefault
							hasValue={ () => !! moneSuffix }
							onDeselect={ () =>
								setAttributes( {
									moneSuffix: undefined,
								} )
							}
						>
							<TextControl
								label={ __( 'Suffix' ) }
								value={ moneSuffix || '' }
								onChange={ ( value ) =>
									setAttributes( { moneSuffix: value } )
								}
								placeholder={ __( 'Suffix' ) }
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
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/post-date',
	registerBlockTypePostDate
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/post-date',
	blockEditPostDate
);
