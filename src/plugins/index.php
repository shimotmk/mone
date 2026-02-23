<?php
/**
 * Plugins
 *
 * @package mone
 */

namespace Mone_Theme\Plugins;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_block_editor_quote
 */
function enqueue_block_editor_plugins() {
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/plugins/index.asset.php';
	if ( is_admin() ) {
		wp_enqueue_script(
			'mone-plugins-script',
			MONE_TEMPLATE_DIR_URL . '/build/plugins/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		wp_set_script_translations(
			'mone-plugins-script',
			'mone',
			MONE_TEMPLATE_DIR_PATH . '/languages'
		);
	}
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor_plugins' );

/**
 * 設定項目の登録
 */
function init_plugins() {
	register_setting(
		'mone-option-settings',
		'mone_options',
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

const MONE_OPTION_DEFAULT = array(
	'default_image_id'                   => '',
	'default_image_url'                  => '',
	'thumbnail_template_variation_lists' => array(
		array(
			// htmlからreact elementに変換する DBにはhtmlで保存する.
			'content' => '<!-- wp:group {"backgroundColor":"content-contrast-2"} -->
<div class="wp-block-group has-content-contrast-2-background-color has-background"><!-- wp:paragraph -->
<p>aaaaaaaaaaaaaaaaaaaaaa</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>aaaaaaaaaaaaaaaaaaaaaa</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->',
		),
		array(
			'content' => '<!-- wp:group {"backgroundColor":"content-contrast-2"} -->
<div class="wp-block-group has-content-contrast-2-background-color has-background"><!-- wp:paragraph -->
<p>aaaaaaaaaaaaaaaaaaaaaa</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>aaaaaaaaaaaaaaaaaaaaaa</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->',
		),

	),
);

const MONE_OPTION_PROPERTIES = array(
	'default_image_id'                   => array(
		'type' => 'string',
	),
	'default_image_url'                  => array(
		'type' => 'string',
	),
	'thumbnail_template_variation_lists' => array(
		'type'  => 'array',
		'items' => array(
			'type'       => 'object',
			'properties' => array(
				'code' => array(
					'type' => 'string',
				),
			),
		),
	),
	'is_feature_image_hover_zoom_effect' => array(
		'type' => 'string',
	),
);

/**
 * REST API
 */
function rest_api_init_plugins() {
	register_rest_route(
		'mone-block-editor/v1',
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
	$options = get_option( 'mone_options' );
	return rest_ensure_response( $options );
}

/**
 * REST API callback
 *
 * @param WP_REST_Request $request request.
 */
function post_rest_api_callback( $request ) {
	$json_params = $request->get_json_params();
	update_option( 'mone_options', $json_params );
	return rest_ensure_response(
		array(
			'success' => true,
		)
	);
}
