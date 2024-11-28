/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	useSettings,
	store as blockEditorStore,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { Icon } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';

import { blockCategoryIcon as icon } from './sample-icon';

const ALLOWED_BLOCKS = [ 'mone/icon' ];

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { iconColor, iconGradientColor, width } = attributes;

	const onDimensionChange = ( dimension, nextValue ) => {
		const parsedValue = parseFloat( nextValue );
		if ( isNaN( parsedValue ) && nextValue ) {
			return;
		}
		setAttributes( {
			[ dimension ]: parsedValue < 0 ? '0' : nextValue,
		} );
	};
	const defaultUnits = [ 'px', '%', 'vw', 'em', 'rem' ];
	const spacingUnits = [ ...useSettings( 'spacing.units' )[ 0 ] ];
	const units = useCustomUnits( {
		availableUnits: spacingUnits || defaultUnits,
	} );

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const blockProps = useBlockProps( {
		style: { width },
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		templateInsertUpdatesSelection: true,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => setAttributes( { width: undefined } ) }
				>
					<ToolsPanelItem
						label={ __( 'Width', 'mone' ) }
						isShownByDefault
						hasValue={ () => !! width }
						onDeselect={ () =>
							setAttributes( { width: undefined } )
						}
					>
						<UnitControl
							label={ __( 'Width' ) }
							labelPosition="top"
							value={ width || '' }
							min={ 0 }
							onChange={ ( nextWidth ) =>
								onDimensionChange( 'width', nextWidth )
							}
							units={ units }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'アイコンカラー', 'mone' ),
							resetAllFilter: () => {
								setAttributes( {
									iconColor: undefined,
									iconGradientColor: undefined,
								} );
							},
							isShownByDefault: true,
							enableAlpha: true,
							colorValue: iconColor,
							onColorChange: ( newValue ) => {
								setAttributes( {
									iconColor: newValue,
								} );
							},
							gradientValue: iconGradientColor,
							onGradientChange: ( newValue ) => {
								setAttributes( {
									iconGradientColor: newValue,
								} );
							},
						},
					] }
					panelId={ clientId }
					{ ...colorGradientSettings }
				/>
			</InspectorControls>
			<div { ...innerBlocksProps }>
				<Icon icon={ icon } />
			</div>
		</>
	);
}
