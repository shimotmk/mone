<?php
/**
 * Block_Editor
 *
 * @package mone
 */

namespace Mone_Theme\Block_Editor;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once MONE_TEMPLATE_DIR_PATH . '/build/block-editor/caption/index.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/block-editor/typography/index.php';

/**
 * Enqueue_block_editor
 */
function enqueue_block_editor() {
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/block-editor/index.asset.php';
	if ( is_admin() ) {
		wp_enqueue_script(
			'mone-block-editor-script',
			MONE_TEMPLATE_DIR_URL . '/build/block-editor/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		wp_set_script_translations(
			'mone-block-editor-script',
			'mone',
			MONE_TEMPLATE_DIR_PATH . '/languages'
		);
		wp_enqueue_style(
			'mone/block-editor-editor',
			MONE_TEMPLATE_DIR_URL . '/build/block-editor/index.css',
			array(),
			$asset_file['version']
		);
		wp_enqueue_style(
			'mone/block-editor',
			MONE_TEMPLATE_DIR_URL . '/build/block-editor/style-index.css',
			array(),
			$asset_file['version']
		);
	}
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor' );
