<?php
/**
 * Font-size
 *
 * @package mone
 */

namespace Mone_Theme\Format_Library\Font_Size;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_block_editor_font_size
 */
function enqueue_block_editor_font_size() {
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/format-library/font-size/index.asset.php';
	if ( is_admin() ) {
		wp_enqueue_script(
			'mone-font-size-script',
			MONE_TEMPLATE_DIR_URL . '/build/format-library/font-size/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		wp_set_script_translations(
			'mone-font-size-script',
			'mone',
			MONE_TEMPLATE_DIR_PATH . '/languages'
		);
	}
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor_font_size' );
