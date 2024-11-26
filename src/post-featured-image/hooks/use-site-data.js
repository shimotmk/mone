import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export const useSiteData = () => {
	return useSelect( ( select ) => {
		const { getEditedEntityRecord, getEntityRecord } = select( coreStore );
		const _siteRecord = getEditedEntityRecord( 'root', 'site' );
		const siteData = getEntityRecord( 'root', '__unstableBase' );
		const _siteLogoId = siteData?.site_logo;

		const _siteLogoMediaItemData =
			_siteLogoId &&
			select( coreStore ).getMedia( _siteLogoId, {
				context: 'view',
			} );
		const _isRequestingSiteLogoData =
			_siteLogoId &&
			! select( coreStore ).hasFinishedResolution( 'getMedia', [
				_siteLogoId,
				{ context: 'view' },
			] );
		return {
			siteTitle: _siteRecord?.title,
			siteLogoMediaItemData: _siteLogoMediaItemData,
			isRequestingSiteLogoData: _isRequestingSiteLogoData,
		};
	}, [] );
};
