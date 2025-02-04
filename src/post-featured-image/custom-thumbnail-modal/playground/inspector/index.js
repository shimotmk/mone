import { createSlotFill } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import {
	store as blockEditorStore,
	BlockInspector,
} from '@wordpress/block-editor';

const { Fill, Slot } = createSlotFill( 'MoneInspectorControls' );
export const MoneInspectorControls = ( props ) => (
	<Fill>{ props.children }</Fill>
);
MoneInspectorControls.Slot = Slot;

export const MoneInspectorControlsArea = () => {
	const { selectedWidgetAreaBlock, selectionEnd } = useSelect( ( select ) => {
		const { getSelectedBlock, getBlockSelectionEnd } =
			select( blockEditorStore );
		return {
			selectedWidgetAreaBlock: getSelectedBlock(),
			selectionEnd: getBlockSelectionEnd(),
		};
	}, [] );

	// console.log( 'selectionEnd', selectionEnd );
	// console.log( 'selectedWidgetAreaBlock', selectedWidgetAreaBlock );

	return (
		<>
			<BlockInspector />
		</>
	);
};
