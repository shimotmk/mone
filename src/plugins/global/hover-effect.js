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
import { InfoPopoverLabel } from '../../components/info-popover-label';

export const ShowFeatureImageHoverZoomEffect = () => {
	const { canUserEdit, optionObj, isFeatureImageHoverZoomEffect } = useSelect(
		( select ) => {
			const { canUser } = select( coreStore );
			const canEdit = canUser( 'update', 'settings' );

			const { getOptions } = select( STORE_NAME );
			return {
				canUserEdit: canEdit,
				optionObj: getOptions(),
				isFeatureImageHoverZoomEffect:
					getOptions().is_feature_image_hover_zoom_effect,
			};
		},
		[]
	);
	const { setOptions } = useDispatch( STORE_NAME );

	if ( ! canUserEdit ) {
		return null;
	}

	return (
		<Flex direction="column">
			<FlexItem>
				<ToggleControl
					__nextHasNoMarginBottom
					checked={
						isFeatureImageHoverZoomEffect === 'adapt' ? true : false
					}
					label={
						<>
							<InfoPopoverLabel
								label={ __(
									'アイキャッチ ホバーエフェクト',
									'mone'
								) }
								message={ __(
									'クエリーブロック内のアイキャッチ画像に、ホバーエフェクトを適用します。',
									'mone'
								) }
								position="bottom right"
							/>
						</>
					}
					onChange={ ( value ) => {
						const newOptionObj = {
							...optionObj,
							is_feature_image_hover_zoom_effect: value
								? 'adapt'
								: 'not_adapt',
						};
						setOptions( newOptionObj );
					} }
				/>
			</FlexItem>
		</Flex>
	);
};
