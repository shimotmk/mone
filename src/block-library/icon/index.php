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
 * Registers the `mone/icon` block on the server.
 *
 * @return void
 */
function register_block() {
	register_block_type( __DIR__ );
}
add_action( 'init', __NAMESPACE__ . '\register_block' );
