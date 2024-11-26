<?php
/**
 * Edit-post
 *
 * @package mone
 */

namespace Mone_Theme\Edit_Post;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_style_edit-post
 */
function enqueue_block_editor_preferences() {
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/edit-post/index.asset.php';
	if ( is_admin() ) {
		wp_enqueue_script(
			'mone-edit-post-script',
			MONE_TEMPLATE_DIR_URL . '/build/edit-post/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		wp_set_script_translations(
			'mone-edit-post-script',
			'mone',
			MONE_TEMPLATE_DIR_PATH . '/languages'
		);
	}
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor_preferences' );

/**
 * Register post meta
 */
function register_post_meta_on_post() {
	$post_types = get_post_types(
		array(
			'public' => true,
		)
	);

	foreach ( $post_types as $post_type ) {
		if ( ! post_type_supports( $post_type, 'custom-fields' ) ) {
			continue;
		}

		register_post_meta(
			$post_type,
			'mone_is_show_post_thumbnail_on_page',
			array(
				'single'            => true,
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_textarea_field',
			)
		);

		register_post_meta(
			$post_type,
			'mone_is_show_share_button_on_page',
			array(
				'single'            => true,
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_textarea_field',
			)
		);

		register_post_meta(
			$post_type,
			'mone_is_show_post_date_on_page',
			array(
				'single'            => true,
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_textarea_field',
			)
		);

	}
}
add_action( 'init', __NAMESPACE__ . '\register_post_meta_on_post' );
