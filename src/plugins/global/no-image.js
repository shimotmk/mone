/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { Flex, FlexItem, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';

export const ShowNoImage = () => {
	const {
		canUserEdit,
		optionObj,
		isShowNoImageOnQuery,
		isShowNoImageOnPage,
	} = useSelect( ( select ) => {
		const { canUser } = select( coreStore );
		const canEdit = canUser( 'update', 'settings' );

		const { getOptions } = select( STORE_NAME );
		return {
			canUserEdit: canEdit,
			optionObj: getOptions(),
			isShowNoImageOnQuery: getOptions().is_show_no_image_on_query,
			isShowNoImageOnPage: getOptions().is_show_no_image_on_page,
		};
	}, [] );
	const { setOptions } = useDispatch( STORE_NAME );

	if ( ! canUserEdit ) {
		return null;
	}

	return (
		<>
			<Flex direction="column">
				<FlexItem>
					<ToggleControl
						__nextHasNoMarginBottom
						checked={
							isShowNoImageOnQuery === 'hide' ? false : true
						}
						label={ __( 'Show NO IMAGE in query', 'mone' ) }
						onChange={ ( value ) => {
							const newOptionObj = {
								...optionObj,
								is_show_no_image_on_query: value
									? 'show'
									: 'hide',
							};
							setOptions( newOptionObj );
						} }
					/>
				</FlexItem>
				<FlexItem>
					<ToggleControl
						__nextHasNoMarginBottom
						checked={
							isShowNoImageOnPage === 'show' ? true : false
						}
						label={ __( 'Show NO IMAGE on the page', 'mone' ) }
						onChange={ ( value ) => {
							const newOptionObj = {
								...optionObj,
								is_show_no_image_on_page: value
									? 'show'
									: 'hide',
							};
							setOptions( newOptionObj );
						} }
					/>
				</FlexItem>
			</Flex>
		</>
	);
};
