/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls, HeightControl } from '@wordpress/block-editor';
import {
	__experimentalHStack as HStack,
	Icon,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	SelectControl,
} from '@wordpress/components';
import { sidesTop, sidesBottom, sidesRight, sidesLeft } from '@wordpress/icons';
import { hasBlockSupport } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

import { cleanEmptyObject } from '../../utils-func/clean-empty-object';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

/**
 * Filter the BlockEdit object and add linked group inspector controls.
 * @param {Object} BlockEdit
 */
function addInspectorControls( BlockEdit ) {
	return ( props ) => {
		const { name, attributes, setAttributes } = props;
		const hasSupportPosition = hasBlockSupport( name, 'position' );
		if ( ! hasSupportPosition ) {
			return <BlockEdit { ...props } />;
		}
		const { style } = attributes;

		const onChangeType = ( value ) => {
			const newStyle = {
				...style,
				position: {
					...style?.position,
					...value,
				},
			};
			setAttributes( {
				style: cleanEmptyObject( newStyle ),
			} );
		};
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		useEffect( () => {
			if (
				( style?.position?.type === 'sticky' ||
					style?.position?.type === 'fixed' ) &&
				style?.position?.top === undefined
			) {
				const newStyle = {
					...style,
					position: {
						...style?.position,
						top: '0px',
					},
				};
				setAttributes( {
					style: cleanEmptyObject( newStyle ),
				} );
			}
		}, [ style?.position?.type, setAttributes, style ] );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Position', 'mone' ) }
						resetAll={ () => {
							const newStyle = {
								...style,
								position: {
									...style?.position,
									type: undefined,
									top: undefined,
									left: undefined,
									bottom: undefined,
									right: undefined,
								},
							};
							setAttributes( {
								style: cleanEmptyObject( newStyle ),
							} );
						} }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							label={ __( 'Type', 'mone' ) }
							isShownByDefault
							hasValue={ () => !! style?.position?.type }
							onDeselect={ () => {
								const newStyle = {
									...style,
									position: {
										...style?.position,
										type: undefined,
									},
								};
								setAttributes( {
									style: cleanEmptyObject( newStyle ),
								} );
							} }
						>
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Type', 'mone' ) }
								value={ style?.position?.type || '' }
								onChange={ ( value ) => {
									const newStyle = {
										...style,
										position: {
											...style?.position,
											type: value,
										},
									};
									setAttributes( {
										style: cleanEmptyObject( newStyle ),
									} );
								} }
								options={ [
									{
										label: __( 'Default', 'mone' ),
										value: '',
									},
									{
										label: __( 'Sticky', 'mone' ),
										value: 'sticky',
									},
									{
										label: __( 'Fixed', 'mone' ),
										value: 'fixed',
									},
								] }
							/>
						</ToolsPanelItem>
						{ style?.position?.type !== '' && (
							<>
								<div
									className="block-editor-block-inspector__position-wrapper"
									style={ {
										gridColumn: '1 / -1',
										display: 'flex',
										flexDirection: 'column',
										gap: '2px',
									} }
								>
									<legend className="blocks-base-control__label">
										{ __( 'Position', 'mone' ) }
									</legend>
									<ToolsPanelItem
										label={ __( 'Top', 'mone' ) }
										isShownByDefault
										hasValue={ () =>
											!! style?.position?.top
										}
										onDeselect={ () =>
											onChangeType( { top: undefined } )
										}
									>
										<HStack className="spacing-sizes-control__wrapper">
											<Icon
												className="spacing-sizes-control__icon"
												icon={ sidesTop }
												size={ 24 }
											/>
											<HeightControl
												label={ '' }
												value={ style?.position?.top }
												onChange={ ( value ) => {
													onChangeType( {
														top: value,
													} );
												} }
											/>
										</HStack>
									</ToolsPanelItem>
									<ToolsPanelItem
										label={ __( 'Right', 'mone' ) }
										isShownByDefault
										hasValue={ () =>
											!! style?.position?.right
										}
										onDeselect={ () =>
											onChangeType( { right: undefined } )
										}
									>
										<HStack className="spacing-sizes-control__wrapper">
											<Icon
												className="spacing-sizes-control__icon"
												icon={ sidesRight }
												size={ 24 }
											/>
											<HeightControl
												label={ '' }
												value={ style?.position?.right }
												onChange={ ( value ) => {
													onChangeType( {
														right: value,
													} );
												} }
											/>
										</HStack>
									</ToolsPanelItem>
									<ToolsPanelItem
										label={ __( 'Bottom', 'mone' ) }
										isShownByDefault
										hasValue={ () =>
											!! style?.position?.bottom
										}
										onDeselect={ () =>
											onChangeType( {
												bottom: undefined,
											} )
										}
									>
										<HStack className="spacing-sizes-control__wrapper">
											<Icon
												className="spacing-sizes-control__icon"
												icon={ sidesBottom }
												size={ 24 }
											/>
											<HeightControl
												label={ '' }
												value={
													style?.position?.bottom
												}
												onChange={ ( value ) => {
													onChangeType( {
														bottom: value,
													} );
												} }
											/>
										</HStack>
									</ToolsPanelItem>
									<ToolsPanelItem
										label={ __( 'Left', 'mone' ) }
										isShownByDefault
										hasValue={ () =>
											!! style?.position?.left
										}
										onDeselect={ () =>
											onChangeType( { left: undefined } )
										}
									>
										<HStack className="spacing-sizes-control__wrapper">
											<Icon
												className="spacing-sizes-control__icon"
												icon={ sidesLeft }
												size={ 24 }
											/>
											<HeightControl
												label={ '' }
												value={ style?.position?.left }
												onChange={ ( value ) => {
													onChangeType( {
														left: value,
													} );
												} }
											/>
										</HStack>
									</ToolsPanelItem>
								</div>
							</>
						) }
						<style>
							{ `
								.block-editor-block-inspector__position-wrapper .components-base-control__label {
									display: none;
								}
                                ` }
						</style>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	};
}

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/group/position-controls',
	addInspectorControls
);
