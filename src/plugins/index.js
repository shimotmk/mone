/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PluginSidebar } from '@wordpress/editor';
import { registerPlugin } from '@wordpress/plugins';

import './store';
import { MoneAnimationLogo } from '../icons';
import { Global } from './global';
import { User } from './user';
import { InfoPopoverLabel } from '../components/info-popover-label';

const sidebarRender = () => {
	return (
		<>
			<PluginSidebar
				key="mone-plugin-sidebar"
				name="mone-sidebar-plugins"
				className="mone-plugin-sidebar"
				title={
					<>
						<InfoPopoverLabel
							label={ __( 'Mone settings', 'mone' ) }
							message={ __(
								'This setting is immediately saved to the database.',
								'mone'
							) }
						/>
					</>
				}
				icon={ MoneAnimationLogo }
			>
				<Global />
				<User />
			</PluginSidebar>
		</>
	);
};
registerPlugin( 'mone-sidebar-plugins', { render: sidebarRender } );
