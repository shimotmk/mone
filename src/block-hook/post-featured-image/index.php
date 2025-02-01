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
