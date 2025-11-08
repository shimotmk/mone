import { __ } from '@wordpress/i18n';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { moreVertical, external } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { CustomThumbnailModal } from '../custom-thumbnail-modal';

export const ThumbnailDropdownMenu = () => {
	const [ isCustomModalOpen, setIsCustomModalOpen ] = useState( false );

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
				{ (
					{
						/* onClose */
					}
				) => (
					<>
						{ /* <MenuGroup>
							<MenuItem
								onClick={ () => {
									onClose();
									setIsCustomModalOpen( true );
								} }
							>
								{ __( 'Featured image Templates', 'mone' ) }
							</MenuItem>
						</MenuGroup> */ }
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
			{ isCustomModalOpen && (
				<>
					<CustomThumbnailModal
						onModalClose={ () => setIsCustomModalOpen( false ) }
					/>
				</>
			) }
		</>
	);
};
