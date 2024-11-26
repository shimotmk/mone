<?php
/**
 * Icon
 *
 * @package mone
 */

namespace Mone_Theme\Format_Library\Code;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_block_editor_icon
 */
function enqueue_block_editor_format_code() {
	wp_enqueue_style(
		'mone/format-code',
		MONE_TEMPLATE_DIR_URL . '/build/format-library/code/style-index.css'
	);
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor_format_code' );

/**
 * Enqueue_style_icon
 */
function enqueue_front_format_code() {
	wp_enqueue_style(
		'mone/format-code',
		MONE_TEMPLATE_DIR_URL . '/build/format-library/code/style-index.css'
	);
}
add_action( 'init', __NAMESPACE__ . '\enqueue_front_format_code' );
