<?php
/**
 * Block_Toolbar
 *
 * @package mone
 */

namespace Mone_Theme\Format_Library;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once MONE_TEMPLATE_DIR_PATH . '/build/format-library/background-gradient/index.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/format-library/code/index.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/format-library/icon/index.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/format-library/image/index.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/format-library/stroke/index.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/format-library/text-gradient/index.php';

/**
 * Enqueue_block_editor_font_size
 */
function enqueue_block_editor_format() {
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/format-library/index.asset.php';
	if ( is_admin() ) {
		wp_enqueue_script(
			'mone-format-script',
			MONE_TEMPLATE_DIR_URL . '/build/format-library/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		wp_set_script_translations(
			'mone-format-script',
			'mone',
			MONE_TEMPLATE_DIR_PATH . '/languages'
		);
		wp_enqueue_style(
			'mone/format-library-editor',
			MONE_TEMPLATE_DIR_URL . '/build/format-library/index.css',
			array(),
			$asset_file['version']
		);
		wp_enqueue_style(
			'mone/format-library',
			MONE_TEMPLATE_DIR_URL . '/build/format-library/style-index.css',
			array(),
			$asset_file['version']
		);
	}
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor_format' );

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

/**
 * Mark CSS safe if it contains a "--the-icon-svg: url(data:image/svg+xml" rule.
 *
 * @param array $allowed_html Allowed HTML.
 * @return array (Maybe) modified allowed HTML.
 */
function allow_svg_in_wp_kses_post( $allowed_tags ) {
	$allowed_tags['svg'] = array(
		'xmlns'        => true,
		'viewBox'      => true,
		'viewbox'      => true,
		'width'        => true,
		'height'       => true,
		'fill'         => true,
		'stroke'       => true,
		'stroke-width' => true,
	);

	$allowed_tags['filter'] = array(
		'id' => true,
	);

	$allowed_tags['feTurbulence'] = array(
		'type'          => true,
		'baseFrequency' => true,
		'numOctaves'    => true,
		'stitchTiles'   => true,
	);

	$allowed_tags['rect'] = array(
		'width'  => true,
		'height' => true,
		'filter' => true,
	);

	$allowed_tags['path'] = array(
		'd'            => true,
		'fill'         => true,
		'stroke'       => true,
		'stroke-width' => true,
		'transform'    => true,
	);

	return $allowed_tags;
}
add_filter( 'wp_kses_allowed_html', __NAMESPACE__ . '\allow_svg_in_wp_kses_post', 10, 1 );
