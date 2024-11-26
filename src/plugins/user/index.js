/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
} from '@wordpress/components';

import {
	ShowFeaturedImageTemplateToggle,
	usePreferencesStore,
	setPreferencesStore,
} from './disable-featured-image-template';

export const User = () => {
	const showFeaturedImageTemplate = usePreferencesStore(
		'showFeaturedImageTemplate'
	);
	return (
		<>
			<ToolsPanel label={ __( 'User Settings', 'mone' ) }>
				<ToolsPanelItem
					hasValue={ () => ! showFeaturedImageTemplate }
					label={ __( 'Eye-catching template', 'mone' ) }
					className="mone-tools-panel-item"
					isShownByDefault={ true }
					onDeselect={ () =>
						setPreferencesStore( 'showFeaturedImageTemplate', true )
					}
				>
					<ShowFeaturedImageTemplateToggle />
				</ToolsPanelItem>
			</ToolsPanel>
		</>
	);
};
