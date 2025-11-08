import {
	__experimentalListView as ListView,
	BlockTools,
	BlockList,
	BlockSelectionClearer,
	WritingFlow,
} from '@wordpress/block-editor';

export const NavigationMenuContent = ( props ) => {
	return (
		<>
			<ListView isExpanded={ true } />
			<BlockTools>
				<BlockSelectionClearer>
					<WritingFlow>
						<BlockList
							className="mone-custom-thumbnail-main-block-list"
							{ ...props }
						/>
					</WritingFlow>
				</BlockSelectionClearer>
			</BlockTools>
		</>
	);
};
