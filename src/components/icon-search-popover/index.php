<?php
/**
 * Icon
 *
 * @package mone
 */

namespace Mone_Theme\Components\Icon_Search_Popover;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_block_editor_icon
 */
function enqueue_block_editor_component_icon() {
	wp_enqueue_style(
		'mone/components-icon-search-popover',
		MONE_TEMPLATE_DIR_URL . '/build/components/icon-search-popover/index.css'
	);
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor_component_icon' );
