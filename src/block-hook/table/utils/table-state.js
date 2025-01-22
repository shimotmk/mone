/**
 * Parts of this source were derived and modified from flexible-table-block,
 * released under the GPL-2.0+ license.
 *
 * https://github.com/t-hamano/flexible-table-block
 *
 * @author Aki Hamano
 *
 * https://github.com/t-hamano/flexible-table-block/blob/main/LICENSE
 */

// https://github.com/t-hamano/flexible-table-block/blob/deac8c0a373c468030daed63cc462d6803b5af26/src/utils/table-state.ts
// appreciate for t-hamano

// Convert string to number.
export function toInteger( value, defaultValue = 0 ) {
	if ( ! value ) {
		return defaultValue;
	}

	const converted = parseInt( String( value ), 10 );

	if ( isNaN( converted ) ) {
		return defaultValue;
	}

	return converted || defaultValue;
}

// Return a set of cells from the start cell and the end cell that will form a rectangle, taking into account the join cells.
// 選択セルの範囲を取得する
export function toRectangledSelectedCells( vTable, { fromCell, toCell } ) {
	if ( ! fromCell || ! toCell ) {
		return [];
	}

	// Check if multiple sections are selected.
	if ( fromCell.sectionName !== toCell.sectionName ) {
		return [];
	}

	// Get the minimum / maximum virtual indexes of the matrix from the selected cells.
	const vRangeIndexes = getVirtualRangeIndexes( [ fromCell, toCell ] );

	let isRectangled = false;

	let { minRowIndex, maxRowIndex, minColIndex, maxColIndex } = vRangeIndexes;

	const currentSection = vTable[ fromCell.sectionName ];
	const rowCount = currentSection.length;
	const colCount = currentSection[ 0 ].cells.length;

	const VCells = currentSection
		.reduce( ( cells, row ) => cells.concat( row.cells ), [] )
		.map( ( cell ) => {
			if (
				cell.rowIndex === fromCell.rowIndex &&
				cell.vColIndex === fromCell.vColIndex
			) {
				cell.isFirstSelected = true;
			}
			return cell;
		} )
		.filter( ( cell ) => ! cell.isHidden );

	// Expand the rectangle if there is a combined cell that passes through each edge.
	while ( ! isRectangled ) {
		// Extend the virtual range to top if there are cells that overlap to top.
		const topCells = VCells.filter( ( cell ) => {
			return (
				( ( cell.vColIndex + cell.colspan - 1 >= minColIndex &&
					cell.vColIndex + cell.colspan - 1 <= maxColIndex ) ||
					( cell.vColIndex >= minColIndex &&
						cell.vColIndex <= maxColIndex ) ) &&
				cell.rowIndex < minRowIndex &&
				cell.rowIndex + cell.rowspan - 1 >= minRowIndex &&
				cell.rowspan > 1
			);
		} );

		const isTopFixed = minRowIndex === 0 || ! topCells.length;
		if ( ! isTopFixed ) {
			minRowIndex--;
		}

		// Extend the virtual range to right if there are cells that overlap to right.
		const rightCells = VCells.filter( ( cell ) => {
			return (
				( ( cell.rowIndex + cell.rowspan - 1 >= minRowIndex &&
					cell.rowIndex + cell.rowspan - 1 <= maxRowIndex ) ||
					( cell.rowIndex >= minRowIndex &&
						cell.rowIndex <= maxRowIndex ) ) &&
				cell.vColIndex <= maxColIndex &&
				cell.vColIndex + cell.colspan - 1 > maxColIndex &&
				cell.colspan > 1
			);
		} );

		const isRightFixed =
			maxColIndex === colCount - 1 || ! rightCells.length;
		if ( ! isRightFixed ) {
			maxColIndex++;
		}

		// Extend the virtual range to bottom if there are cells that overlap to bottom.
		const bottomCells = VCells.filter( ( cell ) => {
			return (
				( ( cell.vColIndex + cell.colspan - 1 >= minColIndex &&
					cell.vColIndex + cell.colspan - 1 <= maxColIndex ) ||
					( cell.vColIndex >= minColIndex &&
						cell.vColIndex <= maxColIndex ) ) &&
				cell.rowIndex <= maxRowIndex &&
				cell.rowIndex + cell.rowspan - 1 > maxRowIndex &&
				cell.rowspan - 1
			);
		} );

		const isBottomFixed =
			maxRowIndex === rowCount - 1 || ! bottomCells.length;
		if ( ! isBottomFixed ) {
			maxRowIndex++;
		}

		// Extend the virtual range to left if there are cells that overlap to left.
		const leftCells = VCells.filter( ( cell ) => {
			return (
				( ( cell.rowIndex + cell.rowspan - 1 >= minRowIndex &&
					cell.rowIndex + cell.rowspan - 1 <= maxRowIndex ) ||
					( cell.rowIndex >= minRowIndex &&
						cell.rowIndex <= maxRowIndex ) ) &&
				cell.vColIndex < minColIndex &&
				cell.vColIndex + cell.colspan - 1 >= minColIndex &&
				cell.colspan > 1
			);
		} );

		const isLeftFixed = maxColIndex === colCount - 1 || ! leftCells.length;
		if ( ! isLeftFixed ) {
			minColIndex--;
		}

		isRectangled =
			isTopFixed && isRightFixed && isBottomFixed && isLeftFixed;
	}

	// Cells in the newly computed rectangle.
	return VCells.filter(
		( cell ) =>
			cell.rowIndex >= minRowIndex &&
			cell.rowIndex <= maxRowIndex &&
			cell.vColIndex >= minColIndex &&
			cell.vColIndex <= maxColIndex
	);
}

/**
 * Remove cells from the virtual table that are not actually needed and convert them to table attributes.
 * 実際には必要のないセルを仮想テーブルから削除し、テーブル属性に変換
 * @param {Object} vTable
 */
export function toTableAttributes( vTable ) {
	return Object.entries( vTable ).reduce(
		( newTableAttributes, [ sectionName, section ] ) => {
			if ( ! section.length ) {
				return newTableAttributes;
			}
			newTableAttributes[ sectionName ] = section.map(
				( { cells } ) => ( {
					cells: cells
						// Delete cells marked as deletion.
						.filter( ( cell ) => ! cell.isHidden )
						// Keep only the properties needed.削除しないプロパティー
						.map( ( cell ) => ( {
							content: cell.content,
							tag: cell.tag,
							id: cell.id,
							headers: cell.headers,
							scope: cell.scope,
							rowspan:
								cell.rowspan > 1
									? String( cell.rowspan )
									: undefined,
							colspan:
								cell.colspan > 1
									? String( cell.colspan )
									: undefined,
						} ) ),
				} )
			);
			return newTableAttributes;
		},
		{
			head: [],
			body: [],
			foot: [],
		}
	);
}

/**
 * Determines whether a virtual section is empty.
 * @param {string} section - Description of section.
 */
export function isEmptySection( section ) {
	return (
		! section ||
		! section.length ||
		section.every( ( { cells } ) => ! ( cells && cells.length ) )
	);
}

/**
 * Create virtual table object with the cells placed in positions based on how they actually look.
 * This function is used to determine the apparent position of a cell when merge / split cells, etc.
 * @param {Object} state
 */
export function toVirtualTable( state ) {
	const { head, body, foot } = state;
	const vSections = {
		head,
		body,
		foot,
	};

	//  vSectionsの中からsectionを分け0からsection.lengthまでそれぞれのcellsで計算して最大のcellsカウントをcolCountにする
	//  sectionのcellsのcolspanがある場合はcolspanの値を足していく
	const colCounts = Object.values( vSections ).map( ( section ) => {
		return section.reduce( ( count, row ) => {
			return Math.max(
				count,
				row.cells.reduce( ( cellCount, cell ) => {
					return cellCount + toInteger( cell.colspan, 1 );
				}, 0 )
			);
		}, 0 );
	} );
	const colCount = Math.max( ...colCounts );

	return Object.entries( vSections ).reduce(
		( vTable, [ sectionName, section ] ) => {
			if ( ! section.length ) {
				return vTable;
			}

			// Create a virtual section array.
			const rowCount = section.length;

			const vSection = Array.from( { length: rowCount } ).map(
				( _row, rowIndex ) => ( {
					cells: Array.from( { length: colCount } ).map(
						( _col, vColIndex ) => ( {
							content: '',
							tag: 'head' === sectionName ? 'th' : 'td',
							rowspan: 1,
							colspan: 1,
							sectionName,
							isHidden: false,
							// Whether the actual cell is placed or not.
							isFilled: false,
							// Dummy indexes.
							rowIndex,
							vColIndex,
						} )
					),
				} )
			);

			// Mapping the actual section cells on the virtual section cell.
			section.forEach( ( row, cRowIndex ) => {
				row.cells.forEach( ( cell ) => {
					// Colmun index on the virtual section excluding cells already marked as "filled".
					const vColIndex = vSection[ cRowIndex ].cells.findIndex(
						( { isFilled } ) => ! isFilled
					);
					const rowspan = toInteger( cell.rowspan, 1 );
					const colspan = toInteger( cell.colspan, 1 );

					// Mark the cell as "filled" and record the position on the virtual section.
					vSection[ cRowIndex ].cells[ vColIndex ] = {
						...cell,
						isFilled: true,
						sectionName,
						rowspan,
						colspan,
						rowIndex: cRowIndex,
						vColIndex,
						isHidden: false,
					};

					// For cells with rowspan / colspan, mark cells that are visually filled as "filled".
					// Additionaly mark it as a cell to be deleted because it does not exist in the actual section.
					if ( colspan > 1 ) {
						for ( let i = 1; i < colspan; i++ ) {
							if (
								vSection[ cRowIndex ].cells[ vColIndex + i ]
									.isFilled !== undefined
							) {
								vSection[ cRowIndex ].cells[
									vColIndex + i
								].isFilled = true;
							}
							if (
								vSection[ cRowIndex ].cells[ vColIndex + i ]
									.isHidden !== undefined
							) {
								vSection[ cRowIndex ].cells[
									vColIndex + i
								].isHidden = true;
							}
						}
					}
					if ( rowspan > 1 ) {
						for ( let i = 1; i < rowspan; i++ ) {
							if (
								vSection[ cRowIndex + i ]?.cells[ vColIndex ]
									.isFilled !== undefined
							) {
								vSection[ cRowIndex + i ].cells[
									vColIndex
								].isFilled = true;
							}
							if (
								vSection[ cRowIndex + i ]?.cells[ vColIndex ]
									.isHidden !== undefined
							) {
								vSection[ cRowIndex + i ].cells[
									vColIndex
								].isHidden = true;
							}

							if ( colspan > 1 ) {
								for ( let j = 1; j < colspan; j++ ) {
									if (
										vSection[ cRowIndex + i ]?.cells[
											vColIndex + j
										].isFilled !== undefined
									) {
										vSection[ cRowIndex + i ].cells[
											vColIndex + j
										].isFilled = true;
									}
									if (
										vSection[ cRowIndex + i ]?.cells[
											vColIndex + j
										].isHidden !== undefined
									) {
										vSection[ cRowIndex + i ].cells[
											vColIndex + j
										].isHidden = true;
									}
								}
							}
						}
					}
				} );
			} );

			vTable[ sectionName ] = vSection;
			return vTable;
		},
		{
			head: [],
			body: [],
			foot: [],
		}
	);
}

// Get the minimum / maximum row / column virtual indexes on virtual table from selected cells.
export function getVirtualRangeIndexes( selectedCells ) {
	return selectedCells.reduce(
		( { minRowIndex, maxRowIndex, minColIndex, maxColIndex }, cell ) => {
			const VRowIndex =
				cell.rowspan > 1
					? cell.rowIndex + cell.rowspan - 1
					: cell.rowIndex;
			const vColIndex =
				cell.colspan > 1
					? cell.vColIndex + cell.colspan - 1
					: cell.vColIndex;

			return {
				minRowIndex:
					minRowIndex < cell.rowIndex ? minRowIndex : cell.rowIndex,
				maxRowIndex: maxRowIndex > VRowIndex ? maxRowIndex : VRowIndex,
				minColIndex:
					minColIndex < cell.vColIndex ? minColIndex : cell.vColIndex,
				maxColIndex: maxColIndex > vColIndex ? maxColIndex : vColIndex,
			};
		},
		{
			minRowIndex: selectedCells[ 0 ].rowIndex,
			maxRowIndex: selectedCells[ 0 ].rowIndex,
			minColIndex: selectedCells[ 0 ].vColIndex,
			maxColIndex: selectedCells[ 0 ].vColIndex,
		}
	);
}

// Merge cells in the virtual table.
export function mergeCells( vTable, selectedCells, isMergeContent ) {
	if ( ! selectedCells || ! selectedCells.length ) {
		return vTable;
	}

	const sectionName = selectedCells[ 0 ].sectionName;

	// Create the minimum / maximum virtual indexes of the matrix from the selected cells.
	const vRangeIndexes = getVirtualRangeIndexes( selectedCells );

	const { minRowIndex, maxRowIndex, minColIndex, maxColIndex } =
		vRangeIndexes;

	// Find the rowspan & colspan cells in selected cells.
	const rowColSpanCellsCount = selectedCells.filter(
		( { rowspan, colspan } ) => rowspan > 1 || colspan > 1
	).length;

	// Split the found rowspan & colspan cells before merge cell.
	if ( rowColSpanCellsCount ) {
		for ( let i = 0; i < rowColSpanCellsCount; i++ ) {
			const vMergedCells = vTable[ sectionName ]
				.reduce( ( cells, row ) => cells.concat( row.cells ), [] )
				.filter(
					( cell ) =>
						( cell.rowspan > 1 || cell.colspan > 1 ) &&
						minRowIndex <= cell.rowIndex &&
						maxRowIndex >= cell.rowIndex &&
						minColIndex <= cell.vColIndex &&
						maxColIndex >= cell.vColIndex
				);

			if ( vMergedCells.length ) {
				vTable = splitMergedCell( vTable, vMergedCells[ 0 ] );
			}
		}
	}

	// Merge the contents of the cells to be merged.
	const mergedCellsContent = vTable[ sectionName ]
		.reduce( ( cells, row ) => cells.concat( row.cells ), [] )
		.reduce( ( result, cell ) => {
			if (
				cell.rowIndex >= minRowIndex &&
				cell.rowIndex <= maxRowIndex &&
				cell.vColIndex >= minColIndex &&
				cell.vColIndex <= maxColIndex &&
				cell.content
			) {
				result.push( cell.content );
			}
			return result;
		}, [] )
		.join( '<br>' );

	return {
		...vTable,
		[ sectionName ]: vTable[ sectionName ].map( ( row, rowIndex ) => {
			if ( rowIndex < minRowIndex || rowIndex > maxRowIndex ) {
				// Row not to be merged.
				return row;
			}

			return {
				cells: row.cells.map( ( cell, vColIndex ) => {
					if (
						vColIndex === minColIndex &&
						rowIndex === minRowIndex
					) {
						// Cell to merge.
						return {
							...cell,
							rowspan: Math.abs( maxRowIndex - minRowIndex ) + 1,
							colspan: Math.abs( maxColIndex - minColIndex ) + 1,
							content: isMergeContent
								? mergedCellsContent
								: cell.content,
						};
					}

					// Cells to be merged (Mark as deletion).
					if (
						rowIndex >= minRowIndex &&
						rowIndex <= maxRowIndex &&
						vColIndex >= minColIndex &&
						vColIndex <= maxColIndex
					) {
						return {
							...cell,
							isHidden: true,
						};
					}

					// Cells not to be merged.
					return cell;
				} ),
			};
		} ),
	};
}

// Split single cell in the virtual table state.
export function splitMergedCell( vTable, selectedCell ) {
	const { sectionName, rowIndex, vColIndex, rowspan, colspan } = selectedCell;

	const vSection = vTable[ sectionName ];

	// Split the selected cells and map them on the virtual section.
	vSection[ rowIndex ].cells[ vColIndex ] = {
		...vSection[ rowIndex ].cells[ vColIndex ],
		rowspan: 1,
		colspan: 1,
	};

	if ( colspan > 1 ) {
		for ( let i = 1; i < colspan; i++ ) {
			vSection[ rowIndex ].cells[ vColIndex + i ] = {
				...vSection[ rowIndex ].cells[ vColIndex ],
				content: '',
				vColIndex: vColIndex + i,
				isHidden: false,
			};
		}
	}

	if ( rowspan > 1 ) {
		for ( let i = 1; i < rowspan; i++ ) {
			vSection[ rowIndex + i ].cells[ vColIndex ] = {
				...vSection[ rowIndex ].cells[ vColIndex ],
				content: '',
				rowIndex: rowIndex + i,
				isHidden: false,
			};

			if ( colspan > 1 ) {
				for ( let j = 1; j < colspan; j++ ) {
					vSection[ rowIndex + i ].cells[ vColIndex + j ] = {
						...vSection[ rowIndex ].cells[ vColIndex ],
						content: '',
						rowIndex: rowIndex + i,
						vColIndex: vColIndex + i,
						isHidden: false,
					};
				}
			}
		}
	}

	return {
		...vTable,
		[ sectionName ]: vSection,
	};
}

// Split selected cells in the virtual table state.
export function splitMergedCells( vTable, selectedCells ) {
	if ( ! selectedCells ) {
		return vTable;
	}
	// Find the rowspan & colspan cells.
	const rowColSpanCells = selectedCells.filter(
		( { rowspan, colspan } ) => rowspan > 1 || colspan > 1
	);

	// Split the found rowspan & colspan cells.
	if ( rowColSpanCells.length ) {
		rowColSpanCells.forEach( ( cell ) => {
			vTable = splitMergedCell( vTable, cell );
		} );
	}

	return vTable;
}

// Determines whether the selected cells in the virtual table contain merged cells.
export function hasMergedCells( selectedCells ) {
	if ( ! selectedCells ) {
		return false;
	}
	return selectedCells.some(
		( { rowspan, colspan } ) => rowspan > 1 || colspan > 1
	);
}

// Determines whether a rectangle will be formed from the selected cells in the virtual table.
// This function is used to determines whether to allow cell merging from the selected cells.
export function isRectangleSelected( selectedCells ) {
	if ( ! selectedCells ) {
		return false;
	}

	// No need to merge If only one or no cell is selected.
	if ( selectedCells.length <= 1 ) {
		return false;
	}

	// Check if multiple sections are selected.
	if ( isMultiSectionSelected( selectedCells ) ) {
		return false;
	}

	// Get the minimum / maximum virtual indexes of the matrix from the selected cells.
	const vRangeIndexes = getVirtualRangeIndexes( selectedCells );

	// Generate indexed matrix from the indexes.
	const vRange = [];

	for (
		let i = vRangeIndexes.minRowIndex;
		i <= vRangeIndexes.maxRowIndex;
		i++
	) {
		vRange[ i ] = [];
		for (
			let j = vRangeIndexes.minColIndex;
			j <= vRangeIndexes.maxColIndex;
			j++
		) {
			vRange[ i ][ j ] = false;
		}
	}

	// Map the selected cells to the matrix (mark the cell as "true").
	selectedCells.forEach( ( cell ) => {
		if (
			cell.rowIndex in vRange &&
			cell.vColIndex in vRange[ cell.rowIndex ]
		) {
			vRange[ cell.rowIndex ][ cell.vColIndex ] = true;

			if ( cell.colspan > 1 ) {
				for ( let i = 1; i < cell.colspan; i++ ) {
					vRange[ cell.rowIndex ][ cell.vColIndex + i ] = true;
				}
			}

			if ( cell.rowspan > 1 ) {
				for ( let i = 1; i < cell.rowspan; i++ ) {
					vRange[ cell.rowIndex + i ][ cell.vColIndex ] = true;

					if ( cell.colspan > 1 ) {
						for ( let j = 1; j < cell.colspan; j++ ) {
							vRange[ cell.rowIndex + i ][
								cell.vColIndex + j
							] = true;
						}
					}
				}
			}
		}
	} );

	// Whether all cells in the matrix are filled (whether cell merging is possible).
	return vRange
		.reduce( ( cells, row ) => cells.concat( row ), [] )
		.every( ( cell ) => cell );
}

// Determines whether multiple sections are selected on the virtual table.
export function isMultiSectionSelected( selectedCells ) {
	const selectedSections = selectedCells.reduce( ( result, selectedCell ) => {
		if ( ! result.includes( selectedCell.sectionName ) ) {
			result.push( selectedCell.sectionName );
		}
		return result;
	}, [] );

	return selectedSections.length > 1;
}
