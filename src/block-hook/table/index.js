/**
 * External dependencies
 */
import fastDeepEqual from 'fast-deep-equal/es6';

import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, Flex, FlexItem } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import {
	mergeCells,
	splitMergedCells,
	hasMergedCells,
	isRectangleSelected,
	toTableAttributes,
	toVirtualTable,
} from './utils/table-state.js';
import { Table } from './elements/table.js';

import './editor.scss';

export const blockEditTable = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, setAttributes } = props;
		if ( name !== 'core/table' ) {
			return <BlockEdit { ...props } />;
		}

		const [ selectedCells, setSelectedCells ] = useState();
		const [ vTable, setVTable ] = useState( [] );
		const { createSuccessNotice } = useDispatch( noticesStore );
		useEffect( () => {
			setVTable( toVirtualTable( props.attributes ) );
		}, [ props.attributes ] );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Merging and splitting cells', 'mone' ) }
						initialOpen={ true }
					>
						<div className="wp-block-mone-inspector-table">
							<Table
								vTable={ vTable }
								selectedCells={ selectedCells }
								setSelectedCells={ setSelectedCells }
							/>
						</div>
						<Flex
							justify="start"
							style={ { marginBottom: '1rem' } }
						>
							<FlexItem style={ { flex: '1' } }>
								<Button
									style={ {
										width: '100%',
										justifyContent: 'center',
									} }
									variant="secondary"
									onClick={ () => {
										const newVTable = mergeCells(
											vTable,
											selectedCells
										);
										setAttributes(
											toTableAttributes( newVTable )
										);
										setSelectedCells( undefined );
									} }
									disabled={
										! selectedCells ||
										! isRectangleSelected( selectedCells )
									}
									text={ __( 'Merge Cells', 'mone' ) }
								></Button>
							</FlexItem>
							<FlexItem style={ { flex: '1' } }>
								<Button
									style={ {
										width: '100%',
										justifyContent: 'center',
									} }
									variant="secondary"
									onClick={ () => {
										const newVTable = splitMergedCells(
											vTable,
											selectedCells
										);
										setAttributes(
											toTableAttributes( newVTable )
										);
										setSelectedCells( undefined );
									} }
									disabled={
										! selectedCells ||
										! hasMergedCells( selectedCells )
									}
									text={ __( 'Split Cell', 'mone' ) }
								></Button>
							</FlexItem>
						</Flex>
						<Flex
							justify="start"
							style={ { marginBottom: '1rem' } }
						>
							<FlexItem style={ { flex: '1' } }>
								<Button
									style={ {
										width: '100%',
										justifyContent: 'center',
									} }
									variant="secondary"
									onClick={ () => {
										/*
											vTable.body配列の中のcellsオブジェクトの中の配列の中のオブジェクトのisHiddenがfalseの数と
											props.attributes.body配列の中のcellsオブジェクトの中の配列の中のオブジェクトの数が違ったら追加または削除する
											追加するときは今存在しているcellsオブジェクトの後に{tag:"th"}または{tag:"td"}を追加して配列の数をあわせる
											*/
										const newAttributes = [
											'head',
											'body',
											'foot',
										].reduce(
											( acc, section ) => {
												acc[ section ] =
													props.attributes[
														section
													].map(
														( row, rowIndex ) => {
															const vTableRow =
																vTable[
																	section
																][ rowIndex ];
															if ( ! vTableRow ) {
																return row;
															}

															const visibleCells =
																vTableRow.cells.filter(
																	( cell ) =>
																		! cell.isHidden
																);
															let newRowCells;

															if (
																row.cells
																	.length >
																visibleCells.length
															) {
																// row.cellsの長さをvisibleCellsの長さに合わせて、余分なセルを削除
																newRowCells =
																	row.cells.slice(
																		0,
																		visibleCells.length
																	);
															} else if (
																row.cells
																	.length <
																visibleCells.length
															) {
																// row.cellsに不足分のセルを追加
																newRowCells = [
																	...row.cells,
																	...Array(
																		visibleCells.length -
																			row
																				.cells
																				.length
																	)
																		.fill()
																		.map(
																			() => ( {
																				content:
																					'',
																				tag:
																					section ===
																					'head'
																						? 'th'
																						: 'td',
																			} )
																		),
																];
															} else {
																// row.cellsの長さがvisibleCellsと同じ場合、変更なし
																newRowCells =
																	row.cells;
															}

															return {
																...row,
																cells: newRowCells,
															};
														}
													);

												return acc;
											},
											JSON.parse(
												JSON.stringify(
													props.attributes
												)
											)
										);

										const isBroken =
											! fastDeepEqual(
												newAttributes.head,
												props.attributes.head
											) ||
											! fastDeepEqual(
												newAttributes.body,
												props.attributes.body
											) ||
											! fastDeepEqual(
												newAttributes.foot,
												props.attributes.foot
											);
										if ( ! isBroken ) {
											createSuccessNotice(
												__(
													'No cells to repair',
													'mone'
												),
												{
													type: 'snackbar',
												}
											);
										} else {
											createSuccessNotice(
												__(
													'The cell was repaired',
													'mone'
												),
												{
													type: 'snackbar',
												}
											);
										}

										setAttributes( {
											head: newAttributes.head,
											body: newAttributes.body,
											foot: newAttributes.foot,
										} );
									} }
									text={ __(
										'Repairing broken cells',
										'mone'
									) }
								></Button>
							</FlexItem>
							<FlexItem style={ { flex: '1' } }>
								<Button
									style={ {
										width: '100%',
										justifyContent: 'center',
									} }
									variant="secondary"
									onClick={ () => {
										setSelectedCells( undefined );
									} }
									disabled={
										selectedCells === undefined ||
										selectedCells.length === 0
									}
									text={ __( 'Clear Selection', 'mone' ) }
								></Button>
							</FlexItem>
						</Flex>
					</PanelBody>
				</InspectorControls>
			</>
		);
	}
);

addFilter( 'editor.BlockEdit', 'mone/editor/block-edit/table', blockEditTable );
