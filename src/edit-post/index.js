import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import {
	PluginDocumentSettingPanel,
	store as editorStore,
} from '@wordpress/editor';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import {
	ToggleControl,
	BaseControl,
	__experimentalVStack as VStack,
	TextControl,
} from '@wordpress/components';

const MonePluginDocumentSettingPanel = () => {
	const postType = useSelect(
		( select ) => select( editorStore ).getCurrentPostType(),
		[]
	);

	const currentPost = useSelect(
		( select ) => select( editorStore ).getCurrentPost(),
		[]
	);

	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );

	if (
		! currentPost?.meta ||
		null === currentPost?.meta?.[ 'mone-post-settings-panel' ]
	) {
		return null;
	}

	return (
		<PluginDocumentSettingPanel
			name="mone-post-settings-panel"
			title={ __( 'Mone post settings', 'mone' ) }
		>
			<BaseControl __nextHasNoMarginBottom>
				<VStack spacing={ 4 }>
					<ToggleControl
						label={ __(
							'Display eye-catcher on the page',
							'mone'
						) }
						checked={
							meta?.mone_is_show_post_thumbnail_on_page === 'hide'
								? false
								: true
						}
						onChange={ ( value ) => {
							setMeta( {
								...meta,
								mone_is_show_post_thumbnail_on_page: value
									? 'show'
									: 'hide',
							} );
						} }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __(
							'Display SNS Share Button on the page',
							'mone'
						) }
						checked={
							meta?.mone_is_show_share_button_on_page === 'hide'
								? false
								: true
						}
						onChange={ ( value ) => {
							setMeta( {
								...meta,
								mone_is_show_share_button_on_page: value
									? 'show'
									: 'hide',
							} );
						} }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Display Date on the page', 'mone' ) }
						checked={
							meta?.mone_is_show_post_date_on_page === 'hide'
								? false
								: true
						}
						onChange={ ( value ) => {
							setMeta( {
								...meta,
								mone_is_show_post_date_on_page: value
									? 'show'
									: 'hide',
							} );
						} }
						__nextHasNoMarginBottom
					/>
					<TextControl
						name="mone_thumbnail_youtube_url"
						label={
							<span style={ { textTransform: 'none' } }>
								{ __( 'アイキャッチ用 YouTube動画', 'mone' ) }
							</span>
						}
						__next40pxDefaultSize
						onChange={ ( value ) => {
							setMeta( {
								...meta,
								mone_thumbnail_youtube_url: value,
							} );
						} }
						placeholder="https://www.youtube.com/watch?v=abcdefg"
						value={ meta?.mone_thumbnail_youtube_url || '' }
					/>
				</VStack>
			</BaseControl>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin( 'plugin-document-setting-panel-demo', {
	render: MonePluginDocumentSettingPanel,
} );
