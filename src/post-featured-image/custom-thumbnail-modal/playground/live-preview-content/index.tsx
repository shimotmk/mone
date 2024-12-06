import { TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import { NavigationMenuContent } from './navigation-menus';
import { BlockToSvg } from './block-to-svg';

const initialPreviewPostTitle = __( 'Article Title', 'mone' );

export const LiveSatori = ( { selectedThumbnailId, blocks } ) => {
	const [ previewPostTitle, setPreviewPostTitle ] = useState(
		initialPreviewPostTitle
	);
	const [ isDebug, setIsDebug ] = useState( false );

	return (
		<div className="preview-card-content">
			<BlockToSvg
				blocks={ blocks }
				previewPostTitle={ previewPostTitle }
				isDebug={ isDebug }
				selectedThumbnailId={ selectedThumbnailId }
			/>
			<NavigationMenuContent />
			<TextControl
				label={ __( 'Preview Article Title', 'mone' ) }
				__nextHasNoMarginBottom
				value={ previewPostTitle }
				onChange={ ( value ) => setPreviewPostTitle( value ) }
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				checked={ isDebug }
				label={ __( 'Debug Mode', 'mone' ) }
				onChange={ () => {
					setIsDebug( ! isDebug );
				} }
			/>
		</div>
	);
};
