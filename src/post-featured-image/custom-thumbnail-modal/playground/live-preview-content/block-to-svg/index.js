import { useEffect, useState, Fragment } from '@wordpress/element';

import { fetchFont, generateSvg } from '../../../../satori';
import { useThemeData } from '../../../../hooks/use-theme-data';
import { useSiteData } from '../../../../hooks/use-site-data';
import { useUserData } from '../../../../hooks/use-user-data';
import { createComponentFromBlocks } from '../../../../satori/createComponentFromBlocks';

export const BlockToSvg = ( props ) => {
	const { previewPostTitle, blocks, isDebug } = props;

	const [ result, setResult ] = useState( '' );
	const width = 1200;
	const height = 630;

	const { currentTheme } = useThemeData();
	const { siteLogoMediaItemData, siteTitle, isRequestingSiteLogoData } =
		useSiteData();
	const { myName, myIconUrl, isRequestingMyData } = useUserData();

	useEffect( () => {
		if ( isRequestingSiteLogoData || isRequestingMyData ) {
			return;
		}
		let cancelled = false;
		( async () => {
			if ( cancelled ) {
				return;
			}

			let _DefaultSvg = '';

			try {
				const fontData = await fetchFont( currentTheme.template_uri );
				const svgProps = {
					postTitle: previewPostTitle,
					siteTitle,
					siteLogoUrl: siteLogoMediaItemData?.source_url ?? false,
					authorName: myName,
					authorIconUrl: myIconUrl ?? false,
					isAuthorIconUrl: !! myIconUrl,
					isSiteLogoUrl: !! siteLogoMediaItemData?.source_url,
					blocks: blocks[ 0 ],
				};
				_DefaultSvg = await generateSvg(
					createComponentFromBlocks,
					svgProps,
					fontData,
					isDebug
				);
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Error generating SVG Block:', error );
			}

			setResult( _DefaultSvg );
		} )();

		return () => {
			cancelled = true;
		};
	}, [
		blocks,
		previewPostTitle,
		siteTitle,
		myName,
		myIconUrl,
		isRequestingMyData,
		siteLogoMediaItemData,
		isRequestingSiteLogoData,
		currentTheme,
		isDebug,
	] );

	return (
		<>
			<div className="preview-card">
				<div
					className="result-container"
					dangerouslySetInnerHTML={ {
						__html: `<div class="content-wrapper" style="position:absolute;width:100%;height:100%;max-width:${ width }px;max-height:${ height }px;display:flex;align-items:center;justify-content:center">${ result }</div>`,
					} }
				></div>
			</div>
		</>
	);
};
