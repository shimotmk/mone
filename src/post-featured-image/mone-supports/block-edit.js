import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
} from '@wordpress/components';
import {
	InspectorControls,
	store as blockEditorStore,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { getBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';

const ColorSetting = ( {
	colorValue,
	label,
	onColorChange,
	colors,
	gradientValue,
	onGradientChange,
	gradients,
} ) => (
	<ColorGradientSettingsDropdown
		enableAlpha
		settings={ [
			{
				colorValue,
				label,
				onColorChange,
				colors,
				gradientValue,
				onGradientChange,
				gradients,
			},
		] }
	/>
);

const hasColorSupport = ( blockNameOrType ) => {
	const moneSupport = getBlockSupport( blockNameOrType, 'moneSatori' );
	const colorSupport = moneSupport?.color || false;
	return (
		colorSupport &&
		( colorSupport.link === true ||
			colorSupport.gradient === true ||
			colorSupport.background !== false ||
			colorSupport.text !== false )
	);
};

export const BlockEditSatori = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;

		if ( ! hasColorSupport( name ) ) {
			return <BlockEdit { ...props } />;
		}

		const { colorPalette } = useSelect( ( select ) => {
			const { getSettings } = select( blockEditorStore );
			const settings = getSettings();
			return {
				colorPalette: settings.colors,
			};
		}, [] );

		const colorGradientSettings = useMultipleOriginColorsAndGradients();

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<ToolsPanel label={ __( 'Color' ) }>
						<ToolsPanelItem
							hasValue={ () => false }
							label={ __( 'Text' ) }
							className="mone-tools-panel-item"
							isShownByDefault={ true }
						>
							<ColorSetting
								colorValue={ attributes?.moneStyle?.textColor }
								label={ __( 'Text' ) }
								onColorChange={ ( newValue ) => {
									setAttributes( {
										moneStyle: {
											...attributes.moneStyle,
											textColor: newValue,
										},
									} );
								} }
								colors={ colorPalette }
							/>
							<ColorSetting
								colorValue={
									attributes?.moneStyle?.backgroundColor
								}
								label={ __( 'Background' ) }
								onColorChange={ ( newValue ) => {
									if (
										!! attributes?.moneStyle
											?.backgroundGradient
									) {
										setAttributes( {
											moneStyle: {
												...attributes.moneStyle,
												backgroundGradient: '',
												backgroundColor: newValue,
											},
										} );
									}
									setAttributes( {
										moneStyle: {
											...attributes.moneStyle,
											backgroundColor: newValue,
										},
									} );
								} }
								colors={ colorPalette }
								gradientValue={
									attributes?.moneStyle?.backgroundGradient
								}
								onGradientChange={ ( newValue ) => {
									if (
										!! attributes?.moneStyle
											?.backgroundColor
									) {
										setAttributes( {
											moneStyle: {
												...attributes.moneStyle,
												backgroundColor: '',
												backgroundGradient: newValue,
											},
										} );
									}
									setAttributes( {
										moneStyle: {
											...attributes.moneStyle,
											backgroundGradient: newValue,
										},
									} );
								} }
								{ ...colorGradientSettings }
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
	'mone/editor/block-edit/satori/supports-color',
	BlockEditSatori
);
