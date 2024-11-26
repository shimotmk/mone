<?php
/**
 * Post featured image
 *
 * @package mone
 */

namespace Mone_Theme\Post_Featured_Image;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_block_editor
 */
function enqueue_block_post_featured_image() {
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/post-featured-image/index.asset.php';
	if ( is_admin() ) {
		wp_enqueue_script(
			'mone-post-featured-image-script',
			MONE_TEMPLATE_DIR_URL . '/build/post-featured-image/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		wp_enqueue_style(
			'mone/post-featured-image-style',
			MONE_TEMPLATE_DIR_URL . '/build/post-featured-image/style-index.css',
			array(),
			$asset_file['version']
		);

		wp_set_script_translations(
			'mone-post-featured-image-script',
			'mone',
			MONE_TEMPLATE_DIR_PATH . '/languages'
		);
	}
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_post_featured_image' );

/**
 * 設定項目の登録
 */
function init_plugins() {
	register_setting(
		'mone-post-featured-image-option-settings',
		'mone_post_featured_image_options',
		array(
			'type'         => 'object',
			// 'default'      => $default,
			'show_in_rest' => array(
				'schema' => array(
					'type' => 'object',
					// 'properties' => $properties,
				),
			),
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\init_plugins' );

/**
 * REST API
 */
function rest_api_init_plugins() {
	register_rest_route(
		'mone-post-featured-image/v1',
		'settings',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => __NAMESPACE__ . '\get_rest_api_callback',
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			),
			array(
				'methods'             => 'POST',
				'callback'            => __NAMESPACE__ . '\post_rest_api_callback',
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			),
		)
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\rest_api_init_plugins' );

/**
 * REST API callback
 */
function get_rest_api_callback() {
	$options = get_option( 'mone_post_featured_image_options' );
	return rest_ensure_response( $options );
}

/**
 * REST API callback
 *
 * @param WP_REST_Request $request request.
 */
function post_rest_api_callback( $request ) {
	$json_params = $request->get_json_params();
	update_option( 'mone_post_featured_image_options', $json_params );
	return rest_ensure_response(
		array(
			'success' => true,
		)
	);
}
