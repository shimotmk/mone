<?php
/**
 * User Store
 *
 * @package mone
 */

namespace Mone_Theme\Preferences\User;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 設定項目の登録
 */
function register_user_meta_rest() {
	register_meta(
		'user',
		'mone_icon_url',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_user_meta_rest' );

/**
 * REST API
 */
function user_meta_rest_api_init() {
	register_rest_route(
		'mone-user-meta/v1',
		'settings' . '/(?P<user_id>[\/\w-]+)',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => __NAMESPACE__ . '\get_user_meta_rest_api_callback',
				'permission_callback' => function () {
					return current_user_can( 'edit_theme_options' );
				},
			),
			array(
				'methods'             => 'POST',
				'callback'            => __NAMESPACE__ . '\post_user_meta_rest_api_callback',
				'permission_callback' => function () {
					return current_user_can( 'edit_theme_options' );
				},
			),
		)
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\user_meta_rest_api_init' );

/**
 * REST API callback
 *
 * @param WP_REST_Request $request request.
 *
 * @return WP_REST_Response response.
 */
function get_user_meta_rest_api_callback( $request ) {
	$user_id       = $request['user_id'];
	$mone_icon_url = get_user_meta( $user_id, 'mone_icon_url', true );
	return rest_ensure_response( $mone_icon_url );
}

/**
 * REST API callback
 *
 * @param WP_REST_Request $request request.
 *
 * @return WP_REST_Response response.
 */
function post_user_meta_rest_api_callback( $request ) {
	$json_params = $request->get_json_params();
	update_user_meta( $json_params['user_id'], 'mone_icon_url', $json_params['option'] );
	return rest_ensure_response(
		array(
			'success' => true,
		)
	);
}
