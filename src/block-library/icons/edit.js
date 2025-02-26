/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
	getColorObjectByColorValue,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	useSettings,
} from '@wordpress/block-editor';
import {
	FontSizePicker,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { dispatch, useSelect, select } from '@wordpress/data';

import { colorSlugToColorCode } from '../../utils-func/color-slug-to-color-code';
import { __experimentalUseGradient as useGradient } from './use-gradient';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

const ALLOWED_BLOCKS = [ 'mone/icon' ];

const DEFAULT_BLOCK = {
	name: 'mone/icon',
	attributesToCopy: [
		'iconSVG',
		'iconName',
		'iconColor',
		'iconGradient',
		'iconCustomGradient',
		'width',
		'height',
		'url',
		'linkTarget',
		'rel',
		'hoverBackgroundColor',
		// core
		'backgroundColor',
		'border',
		'className',
		'gradient',
		'style',
	],
};

export default function Edit( props ) {
	const { attributes, clientId } = props;
	const { layout } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const { commonAttributes, childrenClientIds } = useSelect( () => {
		const { getBlockAttributes, getBlocks } = select( blockEditorStore );

		const childrenIds = getBlocks( clientId );
		const childClientIds = childrenIds.map( ( child ) => child.clientId );
		const blockAttributes = childClientIds.map( ( childId ) =>
			getBlockAttributes( childId )
		);

		if ( ! blockAttributes.length ) {
			return {
				commonAttributes: {},
				childrenClientIds: [],
			};
		}

		const attributesToCheck = [
			'iconColor',
			'iconGradient',
			'iconCustomGradient',
			'width',
			'height',
			'hoverBackgroundColor',
		];

		const _commonAttributes = attributesToCheck.reduce( ( acc, attr ) => {
			const isCommon = blockAttributes.every(
				( block ) => block[ attr ] === blockAttributes[ 0 ][ attr ]
			);

			return {
				...acc,
				[ attr ]: isCommon ? blockAttributes[ 0 ][ attr ] : undefined,
			};
		}, {} );

		return {
			commonAttributes: _commonAttributes,
			childrenClientIds: childClientIds,
		};
	}, [ clientId ] );

	const onChangeChildrenAttribute = ( target, newValue ) => {
		childrenClientIds.forEach( ( childId ) => {
			dispatch( blockEditorStore ).updateBlockAttributes( childId, {
				[ target ]: newValue,
			} );
		} );
	};
	const [ fontSizes ] = useSettings( 'typography.fontSizes' );

	const onDimensionChange = ( dimension, nextValue ) => {
		const parsedValue = parseFloat( nextValue );
		if ( isNaN( parsedValue ) && nextValue ) {
			return;
		}
		onChangeChildrenAttribute(
			[ dimension ],
			parsedValue < 0 ? '0' : nextValue
		);
	};
	const { gradientValue, setGradient } = useGradient( {
		gradientAttribute: 'iconGradient',
		customGradientAttribute: 'iconCustomGradient',
		clientIds: childrenClientIds,
	} );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		defaultBlock: DEFAULT_BLOCK,
		directInsert: true,
		template: [ ALLOWED_BLOCKS ],
		allowedBlocks: ALLOWED_BLOCKS,
		templateInsertUpdatesSelection: true,
		orientation: layout?.orientation ?? 'horizontal',
	} );

	return (
		<>
			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						onChangeChildrenAttribute( 'width', undefined );
						onChangeChildrenAttribute( 'height', undefined );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Size', 'mone' ) }
						isShownByDefault
						hasValue={ () => !! commonAttributes.width }
						onDeselect={ () => {
							onChangeChildrenAttribute( 'height', undefined );
							onChangeChildrenAttribute( 'height', undefined );
						} }
					>
						<FontSizePicker
							__next40pxDefaultSize
							fontSizes={ fontSizes }
							onChange={ ( nextValue ) => {
								onDimensionChange( 'width', nextValue );
								onDimensionChange( 'height', nextValue );
							} }
							value={ commonAttributes.width || '' }
							withReset={ false }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'Icon Color', 'mone' ),
							resetAllFilter: () => {
								onChangeChildrenAttribute(
									'iconColor',
									undefined
								);
								onChangeChildrenAttribute(
									'iconGradient',
									undefined
								);
								onChangeChildrenAttribute(
									'iconCustomGradient',
									undefined
								);
							},
							isShownByDefault: true,
							enableAlpha: true,
							clearable: true,
							colorValue: colorSlugToColorCode(
								commonAttributes.iconColor
							),
							onColorChange: ( newValue ) => {
								const colorSet =
									select( blockEditorStore ).getSettings()
										.colors;
								const ColorValue = getColorObjectByColorValue(
									colorSet,
									newValue
								);

								if ( ColorValue !== undefined ) {
									onChangeChildrenAttribute(
										'iconColor',
										ColorValue.slug
									);
								} else {
									onChangeChildrenAttribute(
										'iconColor',
										newValue
									);
								}
							},
							gradientValue,
							onGradientChange: setGradient,
						},
						{
							label: __( 'Hover background Color', 'mone' ),
							resetAllFilter: () => {
								onChangeChildrenAttribute(
									'hoverBackgroundColor',
									undefined
								);
							},
							isShownByDefault: true,
							enableAlpha: true,
							clearable: true,
							colorValue: colorSlugToColorCode(
								commonAttributes.hoverBackgroundColor
							),
							onColorChange: ( newValue ) => {
								const colorSet =
									select( blockEditorStore ).getSettings()
										.colors;
								const ColorValue = getColorObjectByColorValue(
									colorSet,
									newValue
								);

								if ( ColorValue !== undefined ) {
									onChangeChildrenAttribute(
										'hoverBackgroundColor',
										ColorValue.slug
									);
								} else {
									onChangeChildrenAttribute(
										'hoverBackgroundColor',
										newValue
									);
								}
							},
						},
					] }
					panelId={ clientId }
					{ ...colorGradientSettings }
				/>
			</InspectorControls>
			<div { ...innerBlocksProps }>{ innerBlocksProps.children }</div>
		</>
	);
}
