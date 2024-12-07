<?php
/**
 * Block Library Index File
 *
 * @package mone
 */

namespace Mone_Theme\Block_Library;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once MONE_TEMPLATE_DIR_PATH . '/build/block-library/embed/class-mone-embed-url.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/block-library/embed/class-mone-embed-entry-point.php';
new \Mone_Embed_Entry_Point();
require_once MONE_TEMPLATE_DIR_PATH . '/build/block-library/github-embed/class-mone-github-embed.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/block-library/github-embed/class-mone-github-embed-entry-point.php';
new \Mone_Github_Embed_Entry_Point();

/**
 * Get blocks
 *
 * @return array
 */
function get_blocks() {
	return array(
		'embed',
		'embed-excerpt',
		'embed-featured-image',
		'embed-site-logo',
		'embed-site-title',
		'embed-title',
		'github-embed',
		'icon',
		'icons',
		'mega-menu',
		'styles-switcher',
		'styles-switcher-item',
		'user-icon',
	);
}

/**
 * Register blocks.
 */
function register_blocks() {
	$blocks = get_blocks();
	foreach ( $blocks as $block ) {
		require_once MONE_TEMPLATE_DIR_PATH . '/build/block-library/' . $block . '/index.php';
	}
}
register_blocks();

/**
 * Enqueue_block_editor
 */
function block_library_enqueue_block_editor() {
	if ( is_admin() ) {
		$blocks = get_blocks();
		foreach ( $blocks as $block ) {
			wp_set_script_translations(
				'mone-' . $block . '-editor-script',
				'mone',
				MONE_TEMPLATE_DIR_PATH . '/languages'
			);
		}
	}
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\block_library_enqueue_block_editor' );
