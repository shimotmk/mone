<?php
/**
 * Icon
 *
 * @package mone
 */

namespace Mone_Theme\Format_Library\Icon;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_block_editor_icon
 */
function enqueue_block_editor_icon() {
	if ( is_admin() ) {
		$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/format-library/icon/index.asset.php';
		wp_register_script(
			'mone-icon-script',
			MONE_TEMPLATE_DIR_URL . '/build/format-library/icon/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		wp_enqueue_script( 'mone-icon-script' );
		$data_to_pass = array(
			'some_value'  => 'This is a value from PHP',
			'templateUri' => MONE_TEMPLATE_DIR_URL,
		);
		wp_localize_script( 'mone-icon-script', 'moneData', $data_to_pass );
		wp_set_script_translations(
			'mone-icon-script',
			'mone',
			MONE_TEMPLATE_DIR_PATH . '/languages'
		);
	}

	wp_enqueue_style(
		'mone/icon',
		MONE_TEMPLATE_DIR_URL . '/build/format-library/icon/style-index.css'
	);
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor_icon' );

/**
 * Enqueue_style_icon
 */
function register_format_icon() {
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/format-library/icon/index.asset.php';
	wp_enqueue_style(
		'mone/icon',
		MONE_TEMPLATE_DIR_URL . '/build/format-library/icon/style-index.css',
		array(),
		$asset_file['version']
	);
}
add_action( 'init', __NAMESPACE__ . '\register_format_icon' );

/**
 * Mark CSS safe if it contains a "--the-icon-svg: url(data:image/svg+xml" rule.
 *
 * @param bool   $allow_css Whether the CSS is allowed.
 * @param string $css_test_string The CSS to test.
 */
function safecss_filter_attr_allow_css( $allow_css, $css_test_string ) {
	// インラインアイコンを許可.
	if ( '--the-icon-svg: url(data:image/svg+xml' === $css_test_string ) {
		return true;
	}
	if ( preg_match( '/^base64,[-a-zA-Z0-9_\/\+=]+\)/', $css_test_string ) ) {
		$allow_css = true;
	}
	return $allow_css;
}
add_filter( 'safecss_filter_attr_allow_css', __NAMESPACE__ . '\safecss_filter_attr_allow_css', 10, 2 );
