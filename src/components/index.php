<?php
/**
 * Components
 *
 * @package mone
 */

namespace Mone_Theme\Components;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_block_editor_icon
 */
function enqueue_block_editor_component() {
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/components/index.asset.php';
	if ( is_admin() ) {
		wp_enqueue_style(
			'mone/components',
			MONE_TEMPLATE_DIR_URL . '/build/components/index.css',
			array(),
			$asset_file['version']
		);
	}
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor_component' );
