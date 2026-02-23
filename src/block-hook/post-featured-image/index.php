<?php
/**
 * デフォルトサムネイル
 *
 * @package mone
 */

namespace Mone_Theme\Post_Featured_Image;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * アイキャッチ画像の属性を設定する
 * コアのrender_block_core_post_featured_image
 *
 * @param array $parsed_block parsed_block.
 * @return array
 */
function set_featured_image_attributes( $parsed_block ) {
	$attributes = $parsed_block['attrs'];

	$size_slug = isset( $attributes['sizeSlug'] ) ? $attributes['sizeSlug'] : 'post-thumbnail';
	$attr      = get_block_core_post_featured_image_border_attributes( $attributes );

	$extra_styles = '';

	// Aspect ratio with a height set needs to override the default width/height.
	if ( ! empty( $attributes['aspectRatio'] ) ) {
		$extra_styles .= 'width:100%;height:100%;';
	} elseif ( ! empty( $attributes['height'] ) ) {
		$extra_styles .= "height:{$attributes['height']};";
	}

	if ( ! empty( $attributes['scale'] ) ) {
		$extra_styles .= "object-fit:{$attributes['scale']};";
	} else {
		$extra_styles .= 'object-fit:cover;';
	}
	if ( ! empty( $attributes['style']['shadow'] ) ) {
		$shadow_styles = wp_style_engine_get_styles( array( 'shadow' => $attributes['style']['shadow'] ) );

		if ( ! empty( $shadow_styles['css'] ) ) {
			$extra_styles .= $shadow_styles['css'];
		}
	}

	if ( ! empty( $extra_styles ) ) {
		$attr['style'] = empty( $attr['style'] ) ? $extra_styles : $attr['style'] . $extra_styles;
	}

	return array(
		'attr'      => $attr,
		'size_slug' => $size_slug,
	);
}

/**
 * カスタムサムネイルのHTMLを返す
 *
 * @param string $html html.
 * @return string
 */
function custom_post_thumbnail_html( $html ) {
	global $mone_post_featured_image_attr;
	global $mone_post_featured_image_size_slug;

	if ( '' !== $html ) {
		return $html;
	}

	$default_image_id = get_option( 'mone_options' )['default_image_id'] ?? false;
	if ( $default_image_id ) {
		$html = wp_get_attachment_image( $default_image_id, $mone_post_featured_image_size_slug, false, $mone_post_featured_image_attr );
	} else {
		$default_no_image_url       = MONE_TEMPLATE_DIR_URL . '/assets/images/no-image.png';
		$adjust_width_height_filter = function () use ( $default_no_image_url ) {
			return array(
				$default_no_image_url,
				1200,
				630,
				false,
			);
		};
		add_filter( 'wp_get_attachment_image_src', $adjust_width_height_filter );
		$html = wp_get_attachment_image( 0, $mone_post_featured_image_size_slug, false, $mone_post_featured_image_attr );
		remove_filter( 'wp_get_attachment_image_src', $adjust_width_height_filter );
	}

	return $html;
}

/**
 * Add_is_parent_query.
 *
 * @param array $context context.
 * @param array $parsed_block parsed_block.
 * @return array
 */
function add_is_parent_query( $context, $parsed_block ) {
	// 全てのブロックで実行しないとremove_filterしきれない カバーブロックにアイキャッチを設定したときにremove_filterされない.
	$options = get_option( 'mone_options' );
	// クエリー内でNO IMAGEを表示.
	$is_show_no_image_on_query = isset( $options['is_show_no_image_on_query'] ) && 'hide' === $options['is_show_no_image_on_query'] ? false : true;
	// ページ内でNO IMAGEを表示.
	$is_show_no_image_on_page = isset( $options['is_show_no_image_on_page'] ) && 'show' === $options['is_show_no_image_on_page'] ? true : false;

	global $mone_post_featured_image_attr;
	global $mone_post_featured_image_size_slug;
	if ( 'core/post-featured-image' === $parsed_block['blockName'] ) {
		$result                             = set_featured_image_attributes( $parsed_block );
		$mone_post_featured_image_attr      = $result['attr'];
		$mone_post_featured_image_size_slug = $result['size_slug'];
	}

	if ( ( isset( $parsed_block['attrs']['isParentQuery'] ) && $is_show_no_image_on_query ) || $is_show_no_image_on_page ) {
		if ( ! has_filter( 'post_thumbnail_html', __NAMESPACE__ . '\custom_post_thumbnail_html' ) ) {
			add_filter( 'post_thumbnail_html', __NAMESPACE__ . '\custom_post_thumbnail_html' );
		}
	} else {
		if ( has_filter( 'post_thumbnail_html', __NAMESPACE__ . '\custom_post_thumbnail_html' ) ) {
			remove_filter( 'post_thumbnail_html', __NAMESPACE__ . '\custom_post_thumbnail_html' );
		}
	}

	return $context;
}
add_filter( 'render_block_context', __NAMESPACE__ . '\add_is_parent_query', 10, 2 );


/**
 * 投稿テンプレートの子ブロックにアイキャッチ画像がある時にフラグを付ける
 *
 * @param array $blocks blocks.
 * @return array
 */
function update_post_featured_image_blocks( $blocks ) {
	foreach ( $blocks as &$block ) {
		if ( 'core/post-featured-image' === $block['blockName'] ) {
			$block['attrs']['isParentQuery'] = true;
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			$block['innerBlocks'] = update_post_featured_image_blocks( $block['innerBlocks'] );
		}
	}

	return $blocks;
}

/**
 * クエリー内で実行されているかアイキャッチ画像ブロックはattrsを使ってフラグ追加
 *
 * @param array $parsed_block parsed_block.
 * @return array
 */
function add_is_template( $parsed_block ) {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $parsed_block;
	}

	if ( 'core/post-template' !== $parsed_block['blockName'] ) {
		return $parsed_block;
	}

	$parsed_block['innerBlocks'] = update_post_featured_image_blocks( $parsed_block['innerBlocks'] );

	return $parsed_block;
}
add_filter( 'render_block_data', __NAMESPACE__ . '\add_is_template' );

/**
 * Render block
 *
 * @param string $block_content block_content.
 * @param array  $parsed parsed.
 *
 * @return string
 */
function render_block( $block_content, $parsed ) {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $block_content;
	}

	// ループ内はNO IMAGEを表示.
	if ( isset( $parsed['attrs']['isParentQuery'] ) ) {
		// ループ内はホバーエフェクトを適応.
		$is_feature_image_hover_zoom_effect = ( ! empty( get_option( 'mone_options' )['is_feature_image_hover_zoom_effect'] ) && 'adapt' === get_option( 'mone_options' )['is_feature_image_hover_zoom_effect'] ) ? true : false;
		if ( $is_feature_image_hover_zoom_effect ) {
			$p = new \WP_HTML_Tag_Processor( $block_content );
			if ( $p->next_tag() ) {
				$p->add_class( 'mone-post-feature-image-in-query mone-hover-effect-zoom' );
			}
			$block_content = $p->get_updated_html();
		}
		return $block_content;
	}

	// カスタムフィールドで非表示に設定されている場合は表示しない.
	global $post;
	$show_post_thumbnail_on_page = get_post_meta( $post->ID, 'mone_is_show_post_thumbnail_on_page', true );
	if ( 'hide' === $show_post_thumbnail_on_page ) {
		return '';
	}

	return $block_content;
}
add_filter( 'render_block_core/post-featured-image', __NAMESPACE__ . '\render_block', 10, 2 );

/**
 * YouTube動画ID抽出.
 *
 * @param string $url url.
 * @return string|false
 */
function mone_get_youtube_video_id( $url ) {
	if ( empty( $url ) ) {
		return false;
	}
	$patterns = array(
		'~youtu\.be/([a-zA-Z0-9_-]+)~i',
		'~youtube\.com/watch\?.*v=([a-zA-Z0-9_-]+)~i',
		'~youtube\.com/embed/([a-zA-Z0-9_-]+)~i',
		'~youtube\.com/v/([a-zA-Z0-9_-]+)~i',
	);
	foreach ( $patterns as $pattern ) {
		if ( preg_match( $pattern, $url, $matches ) ) {
			return $matches[1];
		}
	}
	return false;
}

/**
 * YouTube動画クエリーパラメータ取得.
 *
 * @param string $url url.
 * @param string $key key.
 * @return string|null
 */
function mone_get_youtube_parameter( $url, $key ) {
	$query_str = parse_url( $url, PHP_URL_QUERY );
	parse_str( $query_str, $params );
	return isset( $params[ $key ] ) ? $params[ $key ] : null;
}
/**
 * 投稿サムネイルブロックのカスタマイズ
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 * @param object $instance instance.
 */
function render_block_post_featured_image( $block_content, $parsed_block, $instance ) {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $block_content;
	}

	if ( ! isset( $instance->context['postId'] ) ) {
		return $block_content;
	}

	$post_id = $instance->context['postId'];
	if ( ! $post_id ) {
		return $block_content;
	}
	$youtube_url = get_post_meta( $post_id, 'mone_thumbnail_youtube_url', true );
	if ( empty( $youtube_url ) ) {
		return $block_content;
	}
	$video_id = mone_get_youtube_video_id( $youtube_url );
	if ( ! $video_id ) {
		return $block_content;
	}
	$thumbnail_url            = 'https://img.youtube.com/vi/' . esc_attr( $video_id ) . '/maxresdefault.jpg';
	$start                    = mone_get_youtube_parameter( $youtube_url, 't' );
	$is_query                 = isset( $parsed_block['attrs']['isParentQuery'] ) ? true : false;
	$result                   = set_featured_image_attributes( $parsed_block );
	$post_featured_image_attr = $result['attr'];
	// 既存のクラスとスタイルを取得.
	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag() ) {
		$existing_featured_image_class = $p->get_attribute( 'class' ) ?? '';
		$existing_featured_image_style = $p->get_attribute( 'style' ) ?? '';
	}
	$block_content = $p->get_updated_html();

	$unique_id = wp_unique_id( 'mone-youtube-embed-' );
	$context   = array(
		'uniqueId'     => $unique_id,
		'isPlaying'    => false,
		'enterTimeout' => null,
		'leaveTimeout' => null,
	);

	// iframeのsrcを生成.
	$origin     = home_url();
	$iframe_src = sprintf(
		'https://www.youtube.com/embed/%s?enablejsapi=1&mute=1&controls=1&rel=0&origin=%s%s',
		esc_attr( $video_id ),
		rawurlencode( $origin ),
		$start ? '&start=' . $start : ''
	);

	wp_enqueue_style( 'wp-block-embed' );

	$query_class = $is_query ? 'youtube-query' : 'youtube-in-query';
	$img_class   = $post_featured_image_attr['class'] ?? '';
	$img_style   = $post_featured_image_attr['style'] ?? '';

	ob_start();
	?>
	<figure
		class="wp-block-embed is-type-video is-provider-youtube wp-block-embed-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio youtube-hover-wrapper mone-post-featured-image-youtube <?php echo esc_attr( "$query_class $existing_featured_image_class" ); ?>"
		style="position:relative; cursor:pointer; overflow:hidden; aspect-ratio:16/9; <?php echo esc_attr( $existing_featured_image_style ); ?>"
		<?php if ( $is_query ) : ?>
			data-wp-interactive="mone/post-featured-image-youtube-video"
			data-wp-context='<?php echo esc_attr( json_encode( $context ) ); ?>'
			data-wp-on--mouseenter="actions.playVideo"
			data-wp-on--mouseleave="actions.pauseVideo"
			data-wp-init="actions.initPlayer"
		<?php endif; ?>
	>
		<div class="wp-block-embed__wrapper" style="height:100%;">
			<?php if ( $is_query ) : ?>
				<img
					src="<?php echo esc_url( $thumbnail_url ); ?>"
					class="<?php echo esc_attr( $img_class ); ?>"
					style="<?php echo esc_attr( $img_style ); ?> position:absolute; top:0; left:0; width:100%; height:100%; z-index:2; transition: opacity 0.3s;"
					data-wp-bind--hidden="state.isPlaying"
				/>
			<?php endif; ?>

			<iframe
				src="<?php echo esc_url( $iframe_src ); ?>"
				frameborder="0"
				allowfullscreen
				allow="autoplay; encrypted-media"
				<?php if ( $is_query ) : ?>
					class="mone-thumbnail-youtube-iframe <?php echo esc_attr( $img_class ); ?>"
					style="<?php echo esc_attr( $img_style ); ?>"
					data-wp-bind--data-is-playing="state.isPlaying"
				<?php endif; ?>
			></iframe>
		</div>
	</figure>
	<?php
	return ob_get_clean();
}
add_filter( 'render_block_core/post-featured-image', __NAMESPACE__ . '\render_block_post_featured_image', 10, 3 );
