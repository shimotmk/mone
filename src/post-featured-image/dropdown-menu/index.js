import { __ } from '@wordpress/i18n';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { moreVertical, external } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';

export const ThumbnailDropdownMenu = () => {
	const userSettingHref = addQueryArgs( 'profile.php#mone-icon-url' );

	return (
		<>
			<DropdownMenu
				icon={ moreVertical }
				label={ __( 'Options' ) }
				toggleProps={ {
					tooltipPosition: 'bottom',
					size: 'small',
				} }
			>
				{ () => (
					<>
						<MenuGroup>
							<MenuItem
								icon={ external }
								href={ userSettingHref }
							>
								{ __( 'User Settings', 'mone' ) }
							</MenuItem>
						</MenuGroup>
					</>
				) }
			</DropdownMenu>
		</>
	);
};
