import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export const useSiteData = () => {
	return useSelect( ( select ) => {
		const {
			getEditedEntityRecord,
			getEntityRecord,
			hasFinishedResolution,
		} = select( coreStore );
		const _siteRecord = getEditedEntityRecord( 'root', 'site' );
		const siteData = getEntityRecord( 'root', '__unstableBase' );
		const _siteLogoId = siteData?.site_logo;

		const _siteLogoMediaItemData =
			_siteLogoId &&
			getEntityRecord( 'postType', 'attachment', _siteLogoId, {
				context: 'view',
			} );
		const siteLogoUrl = _siteLogoMediaItemData?.source_url ?? false;
		const _isRequestingSiteLogoData =
			_siteLogoId &&
			! hasFinishedResolution( 'getEntityRecord', [
				'postType',
				'attachment',
				_siteLogoId,
				{ context: 'view' },
			] );
		return {
			siteTitle: _siteRecord?.title,
			siteLogoUrl,
			isRequestingSiteLogoData: _isRequestingSiteLogoData,
		};
	}, [] );
};
