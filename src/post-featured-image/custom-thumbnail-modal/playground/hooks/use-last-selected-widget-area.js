/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { STORE_NAME } from '../../../store/constants';
import { KIND, POST_TYPE, buildWidgetAreasPostId } from '../../../store/utils';

// thumbnailIdからこのカスタムフックで選択しているブロックを取得したい
// 選択しているブロックが無ければ最初のclientIdを返す
const useLastSelectedWidgetArea = ( { selectedThumbnailId } ) =>
	useSelect( ( select ) => {
		const { getBlockSelectionEnd, getBlockName } =
			select( blockEditorStore );
		const { getOptions, getParentWidgetAreaBlock } = select( STORE_NAME );
		const selectionEndClientId = getBlockSelectionEnd();

		console.log( 'selectionEndClientId', selectionEndClientId );
		if ( getBlockName( selectionEndClientId ) === 'core/widget-area' ) {
			return selectionEndClientId;
		}

		// widgetAreaBlockはブロック形式 selectionEndClientIdがまだない
		const widgetAreaBlock =
			getParentWidgetAreaBlock( selectionEndClientId );
		const widgetAreaBlockClientId = widgetAreaBlock?.clientId;
		console.log( 'widgetAreaBlockClientId', widgetAreaBlockClientId );

		// if ( widgetAreaBlockClientId ) {
		// 	return widgetAreaBlockClientId;
		// }

		// widgetAreasPost?.blocksはブロック形式で取得されるはず ブロック形式でpが取得できるはず
		const { getEntityRecord } = select( coreStore );
		const p = select( coreStore ).getEntityRecord(
			'root',
			'postType',
			'widget-areas'
		);

		console.log( 'p', p );
		const widgetAreasPost = getEntityRecord(
			KIND,
			POST_TYPE,
			buildWidgetAreasPostId() // widget-areas
		);
		return widgetAreasPost?.blocks[ 0 ]?.clientId;
	}, [] );

export default useLastSelectedWidgetArea;
