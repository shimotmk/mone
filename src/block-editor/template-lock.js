import { __ } from '@wordpress/i18n';
import { MenuItem } from '@wordpress/components';
import { useSelect, useDispatch, withSelect } from '@wordpress/data';
import {
	BlockSettingsMenuControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { lock, unlock } from '@wordpress/icons';
import { registerPlugin } from '@wordpress/plugins';

export const ContentOnlyMenu = ( { clientId } ) => {
	const { templateLock } = useSelect(
		( select ) => {
			const { getBlockAttributes } = select( blockEditorStore );

			const _templateLock = getBlockAttributes( clientId )?.templateLock;
			return {
				templateLock: _templateLock,
			};
		},
		[ clientId ]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	return (
		<>
			<BlockSettingsMenuControls>
				{ ( { selectedClientIds, selectedBlocks } ) => (
					<>
						{ selectedClientIds.length === 1 &&
							getBlockType( selectedBlocks[ 0 ] )?.attributes
								?.templateLock && (
								<MenuItem
									key="moneTemplateLock"
									icon={
										templateLock === 'contentOnly'
											? lock
											: unlock
									}
									onClick={ () => {
										if ( templateLock === 'contentOnly' ) {
											updateBlockAttributes(
												[ selectedClientIds[ 0 ] ],
												{
													templateLock: undefined,
												}
											);
										} else {
											updateBlockAttributes(
												[ selectedClientIds[ 0 ] ],
												{
													templateLock: 'contentOnly',
												}
											);
										}
									} }
								>
									{ templateLock === 'contentOnly'
										? __( 'Unlock content only', 'mone' )
										: __( 'Lock content only', 'mone' ) }
								</MenuItem>
							) }
					</>
				) }
			</BlockSettingsMenuControls>
		</>
	);
};

const _ContentOnlyMenu = withSelect( ( select ) => {
	return {
		clientId: select( blockEditorStore ).getSelectedBlockClientId(),
	};
} )( ContentOnlyMenu );

registerPlugin( 'mone-content-only-menu', { render: _ContentOnlyMenu } );
