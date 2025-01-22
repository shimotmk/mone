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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { isEmptySection } from '../utils/table-state';

function TSection( props ) {
	const { name, ...restProps } = props;
	const TagName = `t${ name }`;
	return <TagName { ...restProps } />;
}

function Cell( props ) {
	const { name, ...restProps } = props;
	const TagName = name;
	return <TagName { ...restProps } />;
}

export const Table = ( { vTable, selectedCells, setSelectedCells } ) => {
	const tableRef = useRef( null );
	const { createSuccessNotice } = useDispatch( noticesStore );

	const onClickCell = ( event, clickedCell ) => {
		const clickedElement = event.target;
		const isInsideTableBlock =
			clickedElement.closest( '.wp-block-mone-inspector-table' ) !== null;

		if ( ! isInsideTableBlock ) {
			return;
		}

		const { sectionName, rowIndex, vColIndex } = clickedCell;

		if ( selectedCells === undefined || selectedCells.length === 0 ) {
			// Select cell for the first time.
			setSelectedCells( [ { ...clickedCell, isFirstSelected: true } ] );
		} else {
			// Multple select.
			const newSelectedCells = selectedCells ? [ ...selectedCells ] : [];
			const existCellIndex = newSelectedCells.findIndex( ( cell ) => {
				return (
					cell.sectionName === sectionName &&
					cell.rowIndex === rowIndex &&
					cell.vColIndex === vColIndex
				);
			} );

			if (
				newSelectedCells.length &&
				sectionName !== newSelectedCells[ 0 ].sectionName
			) {
				createSuccessNotice(
					__(
						'You cannot select multiple cells from different sections.',
						'mone'
					),
					{
						type: 'snackbar',
					}
				);
				return;
			}

			if ( existCellIndex === -1 ) {
				newSelectedCells.push( clickedCell );
			} else {
				newSelectedCells.splice( existCellIndex, 1 );
			}

			setSelectedCells( newSelectedCells );
		}
	};

	// Remove cells from the virtual table that are not needed for dom rendering.
	const filteredVTable = Object.keys( vTable ).reduce(
		( result, sectionName ) => {
			if ( isEmptySection( vTable[ sectionName ] ) ) {
				return result;
			}
			return {
				...result,
				[ sectionName ]: vTable[ sectionName ].map( ( row ) => ( {
					cells: row.cells.filter( ( cell ) => ! cell.isHidden ),
				} ) ),
			};
		},
		{}
	);

	if ( ! filteredVTable ) {
		return null;
	}

	const filteredSections = Object.keys( filteredVTable );

	const removuFFFC = ( string = '' ) => {
		return string.replace( /\uFFFC/g, '' ).trim();
	};

	const removeHtmlTags = ( str ) => {
		if ( typeof str === 'undefined' || str === null ) {
			return '';
		}
		return str.replace( /<[^>]*>/g, '' ).trim();
	};

	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<table ref={ tableRef }>
			{ filteredSections.map( ( sectionName, sectionIndex ) => (
				<TSection name={ sectionName } key={ sectionIndex }>
					{ filteredVTable[ sectionName ].map( ( row, rowIndex ) => (
						<tr key={ rowIndex }>
							{ row.cells.map( ( cell, cellIndex ) => {
								const {
									content,
									tag,
									id,
									headers,
									scope,
									rowspan,
									colspan,
									vColIndex,
								} = cell;

								// Whether or not the current cell is included in the selected cells.
								const isCellSelected = (
									selectedCells || []
								).some(
									( targetCell ) =>
										targetCell.sectionName ===
											sectionName &&
										targetCell.rowIndex === rowIndex &&
										targetCell.vColIndex === vColIndex
								);

								return (
									<Cell
										key={ cellIndex }
										name={ tag }
										className={
											isCellSelected
												? 'is-selected'
												: undefined
										}
										rowSpan={
											rowspan > 1 ? rowspan : undefined
										}
										colSpan={
											colspan > 1 ? colspan : undefined
										}
										style={ {
											backgroundColor: isCellSelected
												? 'var(--wp-admin-theme-color,#3858e9)'
												: undefined,
										} }
										id={ id }
										headers={ headers }
										scope={ scope }
										onClick={ ( event ) =>
											onClickCell( event, cell )
										}
									>
										{ ! RichText.isEmpty( content ) &&
										!! content.text
											? removuFFFC( content.text )
											: removeHtmlTags( content ) }
									</Cell>
								);
							} ) }
						</tr>
					) ) }
				</TSection>
			) ) }
		</table>
	);
};
