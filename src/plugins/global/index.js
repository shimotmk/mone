/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';
import { DefaultImage } from './default-image';
import { ShowNoImage } from './no-image';
import { GithubToken } from './github-token';

export const Global = () => {
	const { canUserEdit, optionObj } = useSelect( ( select ) => {
		const { canUser } = select( coreStore );
		const canEdit = canUser( 'update', 'settings' );

		const { getOptions } = select( STORE_NAME );
		return {
			canUserEdit: canEdit,
			optionObj: getOptions(),
			mediaId: getOptions().default_image_id,
			mediaSourceUrl: getOptions().default_image_url,
		};
	}, [] );
	const { setOptions } = useDispatch( STORE_NAME );

	if ( ! canUserEdit ) {
		return null;
	}

	return (
		<>
			<ToolsPanel
				label={__( 'Site settings', 'mone' ) }
			>
				<ToolsPanelItem
					hasValue={ () =>
						optionObj.default_image_id !== null &&
						optionObj.default_image_url !== null
							? true
							: false
					}
					label={ __( 'Default NO IMAGE', 'mone' ) }
					className="mone-tools-panel-item"
					isShownByDefault={ true }
					onDeselect={ () => {
						const newOptionObj = {
							...optionObj,
							default_image_id: null,
							default_image_url: null,
						};
						setOptions( newOptionObj );
					} }
				>
					<DefaultImage />
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () =>
						! (
							optionObj.is_show_no_image_on_query === 'show' &&
							optionObj.is_show_no_image_on_page === 'hide'
						)
							? true
							: false
					}
					label={ __( 'NO IMAGE', 'mone' ) }
					isShownByDefault={ true }
					onDeselect={ () => {
						const newOptionObj = {
							...optionObj,
							is_show_no_image_on_query: 'show',
							is_show_no_image_on_page: 'hide',
						};
						setOptions( newOptionObj );
					} }
				>
					<ShowNoImage />
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () =>
						! optionObj.github_access_token ? false : true
					}
					label={ __( 'パーソナルアクセストークン', 'mone' ) }
					isShownByDefault={ true }
					onDeselect={ () => {
						const newOptionObj = {
							...optionObj,
							github_access_token: undefined,
						};
						setOptions( newOptionObj );
					} }
				>
					<GithubToken />
				</ToolsPanelItem>
			</ToolsPanel>
		</>
	);
};
