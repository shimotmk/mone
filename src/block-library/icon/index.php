<?php
/**
 * Registers the `mone/icon` block.
 *
 * @package mone
 */

namespace Mone_Theme\Icon;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render_post_icon
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 * @return string $block_content block_content.
 */
function render_block_mone_icon( $block_content, $parsed_block ) {
	if ( empty( $parsed_block['attrs']['iconGradientColor'] ) ) {
		return $block_content;
	}
	return $block_content;
}
add_filter( 'render_block_mone/icon', __NAMESPACE__ . '\render_block_mone_icon', 10, 2 );


/**
 * Registers the `mone/icon` block on the server.
 *
 * @return void
 */
function register_block() {
	register_block_type( __DIR__ );
}
add_action( 'init', __NAMESPACE__ . '\register_block' );
