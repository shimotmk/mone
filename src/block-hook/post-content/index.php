<?php
/**
 * Post Content
 *
 * @package mone
 */

namespace Mone_Theme\Post_Content;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * マイグレーションする
 */
function migrate_mone_post_views_count() {
	$args = array(
		'post_type'      => 'post',
		'posts_per_page' => -1,
		'post_status'    => 'any',
	);

	$all_posts = get_posts( $args );

	foreach ( $all_posts as $post ) {
		$post_id     = $post->ID;
		$views_count = get_post_meta( $post_id, 'post_views_count', true );
		update_post_meta( $post_id, 'mone_post_views_count', $views_count );
		delete_post_meta( $post_id, 'post_views_count' );
	}
}
add_action( 'init', __NAMESPACE__ . '\migrate_mone_post_views_count' );

/**
 * Set_post_views
 *
 * @param string $post_id post_id.
 */
function mone_set_post_views( $post_id ) {
	$count_key = 'mone_post_views_count';
	$count     = get_post_meta( $post_id, $count_key, true );
	if ( '' === $count ) {
		$count = 0;
		delete_post_meta( $post_id, $count_key );
		add_post_meta( $post_id, $count_key, '0' );
	} else {
		++$count;
		update_post_meta( $post_id, $count_key, $count );
	}
}

/**
 * Render_post_content
 *
 * @param array $context context.
 * @param array $parsed_block parsed_block.
 */
function render_post_content( $context, $parsed_block ) {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $context;
	}

	// ログインユーザーは除外.
	if ( is_user_logged_in() ) {
		return $context;
	}

	if ( 'core/post-content' === $parsed_block['blockName'] ) {
		mone_set_post_views( $context['postId'] );
	}
	return $context;
}
add_filter( 'render_block_context', __NAMESPACE__ . '\render_post_content', 10, 2 );
