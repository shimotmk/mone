import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { useDispatch } from '@wordpress/data';
import {
	__experimentalHStack as HStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { Icon } from '@wordpress/icons';

import { InsertThumbnail } from './insert-thumbnail';
import { ThumbnailDropdownMenu } from './dropdown-menu';
import { blockCategoryIcon } from './icons';
import { usePreferencesStore } from '../plugins/user/disable-featured-image-template';
import './style.scss';

const postFeaturedImageSetting = ( OriginalComponent ) => ( props ) => {
	const { onRemoveImage, onUpdateImage, ...restProps } = props;
	const { editPost } = useDispatch( 'core/editor' );

	const removeImage = () => {
		editPost( {
			featured_media: 0,
		} );
	};

	const uploadImage = ( image ) => {
		editPost( {
			featured_media: image.id,
		} );
	};

	const showFeaturedImageTemplate = usePreferencesStore(
		'showFeaturedImageTemplate'
	);

	return (
		<>
			<OriginalComponent
				onRemoveImage={ removeImage }
				onUpdateImage={ uploadImage }
				{ ...restProps }
			/>
			{ showFeaturedImageTemplate && (
				<>
					<hr style={ { margin: 0 } } />
					<HStack
						spacing={ 2 }
						className="editor-post-card-panel__header"
						align="flex-start"
					>
						<Icon icon={ blockCategoryIcon } />
						<Text
							numberOfLines={ 2 }
							truncate
							className="editor-post-card-panel__title"
							weight={ 500 }
							as="h2"
							lineHeight="20px"
						>
							{ __( 'Featured image Templates', 'mone' ) }
						</Text>
						<ThumbnailDropdownMenu
							postTypeSlug={ props.postType.slug }
							currentPostId={ props.currentPostId }
						/>
					</HStack>
					<div className="mone-thumbnail-template-styles block-editor-block-styles">
						<InsertThumbnail
							uploadImage={ uploadImage }
							postTypeSlug={ props.postType.slug }
							currentPostId={ props.currentPostId }
						/>
					</div>
					<hr style={ { margin: 0 } } />
				</>
			) }
		</>
	);
};

addFilter(
	'editor.PostFeaturedImage',
	'mone/editor/post-featured-image',
	postFeaturedImageSetting
);
