import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalBorderBoxControl as BorderBoxControl,
	BaseControl,
	RangeControl,
	__experimentalUnitControl as UnitControl,
	Flex,
	FlexItem,
} from '@wordpress/components';
import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { getBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

const MAX_BORDER_RADIUS_VALUES = {
	px: 100,
	em: 20,
	rem: 20,
};

const hasBorderSupport = ( blockNameOrType ) => {
	const moneSupport = getBlockSupport( blockNameOrType, 'moneSatori' );
	const borderSupport = moneSupport?.__experimentalBorder || false;
	return (
		borderSupport &&
		( borderSupport.color === true ||
			borderSupport.radius === true ||
			borderSupport.width === true )
	);
};

export const BlockEditSatori = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;

		if ( ! hasBorderSupport( name ) ) {
			return <BlockEdit { ...props } />;
		}

		const { colors } = useSelect( ( select ) => {
			const { getSettings } = select( blockEditorStore );
			const settings = getSettings();
			return {
				colors: settings.colors,
			};
		}, [] );

		// 単位を削除するための関数
		const stripUnit = ( value ) => {
			const numericValue = parseFloat( value );
			return isNaN( numericValue ) ? '' : numericValue;
		};

		const resetAll = useCallback( () => {
			setAttributes( {
				moneStyle: {
					...attributes.moneStyle,
					borderRadius: undefined,
					border: undefined,
				},
			} );
		}, [] );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<ToolsPanel label={ __( 'Border' ) } resetAll={ resetAll }>
						<ToolsPanelItem
							hasValue={ () => !! attributes?.moneStyle?.border }
							label={ __( 'Border' ) }
							onDeselect={ () =>
								setAttributes( {
									moneStyle: {
										...attributes.moneStyle,
										borderRadius:
											attributes?.moneStyle?.borderRadius,
										border: undefined,
									},
								} )
							}
							isShownByDefault={ true }
						>
							<BorderBoxControl
								className="mone-border-box-control"
								colors={ colors }
								enableAlpha
								enableStyle={ false }
								onChange={ ( value ) => {
									setAttributes( {
										moneStyle: {
											...attributes.moneStyle,
											border: value,
										},
									} );
								} }
								// popoverOffset={ 40 }
								// popoverPlacement="left-start"
								value={
									{
										...attributes?.moneStyle?.border,
									} || ''
								}
								size="__unstable-large"
								label={ __( 'Border' ) }
							/>
						</ToolsPanelItem>
						<ToolsPanelItem
							hasValue={ () =>
								!! attributes?.moneStyle?.borderRadius
							}
							label={ __( 'Radius' ) }
							isShownByDefault={ true }
							onDeselect={ () =>
								setAttributes( {
									moneStyle: {
										...attributes.moneStyle,
										borderRadius: undefined,
									},
								} )
							}
						>
							<fieldset className="components-border-radius-control">
								<BaseControl.VisualLabel as="legend">
									{ __( 'Radius' ) }
								</BaseControl.VisualLabel>
								<div className="components-border-radius-control__wrapper">
									<Flex className="mone-quick-custom-border-radius-control">
										<FlexItem style={ { width: '116px' } }>
											<UnitControl
												className="mone-quick-custom-border-radius-control__unit-control"
												aria-label={ __(
													'Border radius'
												) }
												isOnly
												value={
													attributes?.moneStyle
														?.borderRadius || ''
												}
												min={ 0 }
												onChange={ ( value ) => {
													const isNumeric = ! isNaN(
														parseFloat( value )
													);
													const nextValue = isNumeric
														? value
														: undefined;
													setAttributes( {
														moneStyle: {
															...attributes.moneStyle,
															borderRadius:
																nextValue,
														},
													} );
												} }
												size="__unstable-large"
											/>
										</FlexItem>
										<FlexItem
											style={ { flex: '1 1 auto' } }
										>
											<RangeControl
												__next40pxDefaultSize
												label={ __( 'Border radius' ) }
												hideLabelFromVision
												className="components-border-radius-control__range-control"
												value={
													stripUnit(
														attributes?.moneStyle
															?.borderRadius
													) || ''
												}
												min={ 0 }
												max={
													MAX_BORDER_RADIUS_VALUES.px
												}
												initialPosition={ 0 }
												withInputField={ false }
												onChange={ ( value ) => {
													setAttributes( {
														moneStyle: {
															...attributes.moneStyle,
															borderRadius: value,
														},
													} );
												} }
												step={ 1 }
												__nextHasNoMarginBottom
											/>
										</FlexItem>
									</Flex>
								</div>
							</fieldset>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	}
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/satori/supports-border',
	BlockEditSatori
);
