import { __ } from '@wordpress/i18n';
import { MenuItem } from '@wordpress/components';
import { useSelect, useDispatch, withSelect } from '@wordpress/data';
import {
	BlockSettingsMenuControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { getBlockType, switchToBlockType } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';

function useConvertToGroupButtonProps( selectedClientIds ) {
	return useSelect(
		( select ) => {
			const {
				getBlocksByClientId,
				getSelectedBlockClientIds,
				isUngroupable,
				isGroupable,
			} = select( blockEditorStore );
			const { getGroupingBlockName, getBlockType } =
				select( blocksStore );
			const clientIds = selectedClientIds?.length
				? selectedClientIds
				: getSelectedBlockClientIds();
			const blocksSelection = getBlocksByClientId( clientIds );
			const [ firstSelectedBlock ] = blocksSelection;
			const _isUngroupable =
				clientIds.length === 1 && isUngroupable( clientIds[ 0 ] );
			return {
				clientIds,
				isGroupable: isGroupable( clientIds ),
				isUngroupable: _isUngroupable,
				blocksSelection,
				groupingBlockName: getGroupingBlockName(),
				onUngroup:
					_isUngroupable &&
					getBlockType( firstSelectedBlock.name )?.transforms
						?.ungroup,
			};
		},
		[ selectedClientIds ]
	);
}

export const SatoriBlockMenu = ( { clientId } ) => {
	const rootClientId = useSelect(
		( select ) => {
			const { getBlockRootClientId } = select( blockEditorStore );

			return getBlockRootClientId( clientId );
		},
		[ clientId ]
	);

	// const { isGroupable, isUngroupable, blocksSelection } =
	// 	useConvertToGroupButtonProps( [ clientId ] );

	// ConvertToGroupButtonを参考に作る
	const { getSelectedBlockClientIds } = useSelect( blockEditorStore );
	const { replaceBlocks } = useDispatch( blockEditorStore );
	const onConvertToGroup = ( selectedClientIds ) => {
		// const blockTypes = getBlockTypesFromClientIds( selectedClientIds );
		// const { isGroupable, isUngroupable, blocksSelection } =
		// 	useConvertToGroupButtonProps( [ selectedClientIds ] );

		const newBlocks = switchToBlockType( blockTypes, 'mone/satori-group' );
		if ( newBlocks ) {
			replaceBlocks( selectedClientIds, newBlocks );
		}
	};

	return (
		<>
			<BlockSettingsMenuControls>
				{ ( { selectedClientIds, selectedBlocks } ) => (
					<>
						{ /^mone\/satori-(?!wrappe$)/.test(
							getBlockType( selectedBlocks[ 0 ] )?.name
						) && (
							<>
								<MenuItem
									onClick={ () => {
										onConvertToGroup(
											selectedClientIds,
											selectedBlocks
										);
									} }
								>
									{ __( 'Group', 'mone' ) }
								</MenuItem>
							</>
						) }
					</>
				) }
			</BlockSettingsMenuControls>
		</>
	);
};

const _SatoriMenu = withSelect( ( select ) => {
	return {
		clientId: select( blockEditorStore ).getSelectedBlockClientId(),
	};
} )( SatoriBlockMenu );

registerPlugin( 'mone-satori-menu', { render: _SatoriMenu } );
