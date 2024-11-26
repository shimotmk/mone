<?php
/**
 * Admin
 *
 * @package mone
 */

namespace Mone_Theme\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_style_utils
 *
 * @param string $hook_suffix hook_suffix.
 */
function enqueue_admin_styles( $hook_suffix ) {
	if ( 'appearance_page_mone-activate' !== $hook_suffix ) {
		return;
	}

	$asset_file  = include MONE_TEMPLATE_DIR_PATH . '/build/admin/index.asset.php';
	$handle_name = 'mone/admin-scripts';
	wp_enqueue_script(
		$handle_name,
		MONE_TEMPLATE_DIR_URL . '/build/admin/index.js',
		$asset_file['dependencies'],
		$asset_file['version']
	);
	wp_set_script_translations(
		$handle_name,
		'mone',
		MONE_TEMPLATE_DIR_PATH . '/languages'
	);
	$mone_activate_option = get_option( 'mone_activate_option' );
	$data_to_pass         = array(
		'activateOption'  => $mone_activate_option,
		'checkLicense'    => mone_license_check(),
		'forceUpdateUrl'  => esc_url( self_admin_url( 'update-core.php?force-check=1' ) ),
		'licenseCheckUrl' => mone_license_check_home_url(),
	);
	wp_localize_script( $handle_name, 'moneAdminData', $data_to_pass );

	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/admin/index.asset.php';
	wp_enqueue_style(
		'mone/admin-styles',
		MONE_TEMPLATE_DIR_URL . '/build/admin/index.css',
		array( 'wp-components' ),
		$asset_file['version']
	);
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_admin_styles' );

/**
 * 管理画面に独自のメニューとサブメニューを追加
 */
function add_admin_menu() {
	add_submenu_page(
		'themes.php',
		__( 'Activate', 'mone' ),
		__( 'Activate', 'mone' ),
		'manage_options',
		'mone-activate',
		__NAMESPACE__ . '\activate_page_callback'
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\add_admin_menu' );

/**
 * サブメニューのコールバック関数
 */
function activate_page_callback() {
	echo '<div id="mone-activate-admin-wrap"></div>';
}

/**
 * APIエンドポイントの登録
 */
function register_user_certification_api() {
	register_rest_route(
		'mone/v1',
		'license-key',
		array(
			array(
				'methods'             => 'POST',
				'callback'            => __NAMESPACE__ . '\save_mone_user_email',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			),
		)
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_user_certification_api' );

/**
 * ライセンスキーを保存するコールバック関数
 *
 * @param \WP_REST_Request $request リクエストオブジェクト.
 * @return \WP_REST_Response レスポンスオブジェクト.
 */
function save_mone_user_email( \WP_REST_Request $request ) {
	$json_params     = $request->get_json_params();
	$mone_user_email = $json_params['mone_user_email'];

	$options                    = get_option( 'mone_activate_option' );
	$options['mone_user_email'] = $mone_user_email;
	update_option( 'mone_activate_option', $options );

	$response = new \WP_REST_Response( array( 'message' => __( 'User email saved successfully.', 'mone' ) ), 200 );

	return $response;
}
