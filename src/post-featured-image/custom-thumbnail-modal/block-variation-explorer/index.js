/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { DEFAULT_VARIATION_ITEM } from '../../custom-thumbnail-modal';
import { STORE_NAME } from '../../store/constants';

export const PatternExplorerSidebar = ( props ) => {
	const { selectedThumbnailId, onClickCategory } = props;

	const { optionObj } = useSelect( ( select ) => {
		const { getOptions } = select( STORE_NAME );
		return {
			optionObj: getOptions(),
		};
	}, [] );
	const { setOptionsStore } = useDispatch( STORE_NAME );
	const baseClassName = 'block-editor-block-patterns-explorer__sidebar';
	const thumbnailList = Array.isArray(
		optionObj?.thumbnail_template_variation_lists
	)
		? optionObj.thumbnail_template_variation_lists
		: [];

	return (
		<div className={ baseClassName }>
			<div className={ `${ baseClassName }__categories-list` }>
				{ thumbnailList.map( ( element, index ) => {
					return (
						<Button
							key={ index }
							label={ sprintf(
								/* translators: %s */
								__( 'Custom thumbnail %s', 'mone' ),
								index
							) }
							className={ `${ baseClassName }__categories-list__item` }
							isPressed={ selectedThumbnailId === index }
							onClick={ () => {
								onClickCategory( index );
							} }
						>
							{ sprintf(
								/* translators: %s */
								__( 'Custom thumbnail %s', 'mone' ),
								index + 1
							) }
						</Button>
					);
				} ) }
				<Button
					label={ __( 'Add' ) }
					className={ `${ baseClassName }__categories-list__item` }
					isPressed={ selectedThumbnailId === 'add' }
					onClick={ () => {
						const updatedThumbnailList = thumbnailList.concat(
							DEFAULT_VARIATION_ITEM
						);
						const newOptionObj = {
							...optionObj,
							thumbnail_template_variation_lists:
								updatedThumbnailList,
						};
						setOptionsStore( newOptionObj );
					} }
				>
					{ __( 'Add' ) }
				</Button>
			</div>
		</div>
	);
};
