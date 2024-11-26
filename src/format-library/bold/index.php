<?php
/**
 * Icon
 *
 * @package mone
 */

namespace Mone_Theme\Format_Library\Bold;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_block_editor_bold
 */
function enqueue_block_editor_bold() {
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/format-library/bold/index.asset.php';
	if ( is_admin() ) {
		wp_enqueue_script(
			'mone-bold-script',
			MONE_TEMPLATE_DIR_URL . '/build/format-library/bold/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		wp_set_script_translations(
			'mone-bold-script',
			'mone',
			MONE_TEMPLATE_DIR_PATH . '/languages'
		);
	}
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor_bold' );
