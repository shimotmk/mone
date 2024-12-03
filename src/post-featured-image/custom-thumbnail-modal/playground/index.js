import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { rawHandler, serialize } from '@wordpress/blocks';
import { Flex, FlexItem } from '@wordpress/components';
import { BlockEditorProvider } from '@wordpress/block-editor';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';
import { uploadMedia } from '@wordpress/media-utils';

import { Default3 } from '../../satori/template/template';
import {
	useThumbnailOptions,
	useUpdateThumbnailOptions,
} from '../../hooks/use-thumbnail-options';
import { LiveSatori } from './live-preview-content';
import { MoneInspectorControlsArea } from './inspector';

export default function Playground( props ) {
	const { selectedThumbnailId } = props;
	const { blockHtml } = useThumbnailOptions( selectedThumbnailId );
	const updateThumbnailOption =
		useUpdateThumbnailOptions( selectedThumbnailId );
	const blockList = blockHtml || Default3;
	const defaultBlocks = rawHandler( { HTML: Default3 } );
	const blocks = rawHandler( { HTML: blockList } );

	const { editorSettings, hasUploadPermissions } = useSelect( ( select ) => {
		const { getEditorSettings } = select( editorStore );
		const { canUser } = select( coreStore );
		return {
			editorSettings: getEditorSettings(),
			hasUploadPermissions:
				canUser( 'create', {
					kind: 'root',
					name: 'media',
				} ) ?? true,
		};
	}, [] );

	const settings = useMemo( () => {
		let mediaUploadBlockEditor;
		if ( hasUploadPermissions ) {
			mediaUploadBlockEditor = ( { onError, ...argumentsObject } ) => {
				uploadMedia( {
					wpAllowedMimeTypes: editorSettings.allowedMimeTypes,
					onError: ( { message } ) => onError( message ),
					...argumentsObject,
				} );
			};
		}
		return {
			...editorSettings,
			mediaUpload: mediaUploadBlockEditor,
			canLockBlocks: false,
			allowedBlockTypes: [
				'mone/satori-group',
				'mone/satori-post-author-icon',
				'mone/satori-post-author-name',
				'mone/satori-post-title',
				'mone/satori-site-logo',
				'mone/satori-site-title',
			],
			enableOpenverseMediaCategory: false,
		};
	}, [ hasUploadPermissions, editorSettings ] );

	// widgetAreaIdはselectedThumbnailIdの値にしたい
	// const widgetAreaId = useLastSelectedWidgetArea( { selectedThumbnailId } );
	// console.log( 'widgetAreaId', widgetAreaId );
	// const buildWidgetAreasPostId = () => `widget-areas`;
	// const EntityBlock = useEntityBlockEditor(
	// 	'root',
	// 	'postType',
	// 	buildWidgetAreasPostId()
	// );
	// console.log( "EntityBlock", EntityBlock );

	return (
		<div className="mone-custom-ogp-image-container">
			<BlockEditorProvider
				settings={ settings }
				value={ blocks }
				onChange={ ( newValue ) =>
					updateThumbnailOption( {
						blockHtml: serialize( newValue ),
					} )
				}
			>
				<Flex
					className={ 'mone-editor-wrapper' }
					align="flex-start"
					justify="center"
					gap={ 0 }
				>
					<FlexItem className="live-preview">
						<LiveSatori
							selectedThumbnailId={ selectedThumbnailId }
							blocks={ blocks }
						/>
					</FlexItem>
					<FlexItem className="editor-sidebar">
						<MoneInspectorControlsArea
							{ ...props }
							blocks={ blocks }
							selectedThumbnailId={ selectedThumbnailId }
						/>
					</FlexItem>
				</Flex>
			</BlockEditorProvider>
		</div>
	);
}
