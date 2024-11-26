<?php
/**
 * Icon
 *
 * @package mone
 */

namespace Mone_Theme\Preferences;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_style_icon
 */
function enqueue_block_editor_preferences() {
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/preferences/index.asset.php';
	if ( is_admin() ) {
		wp_enqueue_script(
			'mone-preferences-script',
			MONE_TEMPLATE_DIR_URL . '/build/preferences/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		wp_set_script_translations(
			'mone-preferences-script',
			'mone',
			MONE_TEMPLATE_DIR_PATH . '/languages'
		);
	}
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor_preferences' );
