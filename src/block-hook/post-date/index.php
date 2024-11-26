<?php
/**
 * Post-date
 *
 * @package mone
 */

namespace Mone_Theme\Post_Date;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render block post date
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 * @param object $block block.
 *
 * @return string
 */
function render_block_post_date( $block_content, $parsed_block, $block ) {
	if ( ! isset( $parsed_block['attrs']['isParentQuery'] ) ) {
		// ページ内で投稿日を非表示にする設定がされている場合は非表示にする.
		global $post;
		$show_post_date_on_page = get_post_meta( $post->ID, 'mone_is_show_post_date_on_page', true );
		if ( 'hide' === $show_post_date_on_page ) {
			return '';
		}
	}

	if ( ! isset( $block->context['postId'] ) ) {
		return $block_content;
	}

	$post_ID = $block->context['postId'];
	// If the update date and posting date are the same, the update date will not be displayed.
	if ( isset( $parsed_block['attrs']['displayType'] ) && 'modified' === $parsed_block['attrs']['displayType'] ) {
		if ( get_the_modified_date( 'Ymd', $post_ID ) === get_the_date( 'Ymd', $post_ID ) ) {
			return '';
		}
	}

	if ( isset( $parsed_block['attrs']['monePrefix'] ) && $parsed_block['attrs']['monePrefix'] ) {
		$prefix        = '<span class="wp-block-post-date__prefix">' . $parsed_block['attrs']['monePrefix'] . '</span>';
		$block_content = preg_replace( '/<time/', $prefix . '<time', $block_content );
	}

	if ( isset( $parsed_block['attrs']['moneSuffix'] ) && $parsed_block['attrs']['moneSuffix'] ) {
		$suffix        = '<span class="wp-block-post-date__suffix">' . $parsed_block['attrs']['moneSuffix'] . '</span>';
		$block_content = preg_replace( '/<\/time>/', '</time>' . $suffix, $block_content );
	}

	$block_content = new \WP_HTML_Tag_Processor( $block_content );
	if ( isset( $parsed_block['attrs']['displayType'] ) && 'modified' === $parsed_block['attrs']['displayType'] ) {
		if ( $block_content->next_tag( 'time' ) ) {
			$block_content->set_attribute( 'itemprop', 'dateModified' );
		}
	} elseif ( $block_content->next_tag( 'time' ) ) {
		$block_content->set_attribute( 'itemprop', 'datePublished' );
	}
	$block_content = $block_content->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/post-date', __NAMESPACE__ . '\render_block_post_date', 10, 3 );

/**
 * 投稿テンプレートの子ブロックにブロックがある時にフラグを付ける
 *
 * @param array $blocks blocks.
 * @return array
 */
function update_post_date_blocks( $blocks ) {
	foreach ( $blocks as &$block ) {
		if ( 'core/post-date' === $block['blockName'] ) {
			$block['attrs']['isParentQuery'] = true;
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			$block['innerBlocks'] = update_post_date_blocks( $block['innerBlocks'] );
		}
	}

	return $blocks;
}

/**
 * クエリー内で実行されているかattrsを使ってフラグ追加
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

	$parsed_block['innerBlocks'] = update_post_date_blocks( $parsed_block['innerBlocks'] );

	return $parsed_block;
}
add_filter( 'render_block_data', __NAMESPACE__ . '\add_is_template' );
