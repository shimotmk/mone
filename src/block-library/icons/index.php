<?php
/**
 * Registers the `mone/icons` block.
 *
 * @package mone
 */

namespace Mone_Theme\Icons;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the `mone/icons` block on the server.
 *
 * @return void
 */
function register_block() {
	register_block_type( __DIR__ );
}
add_action( 'init', __NAMESPACE__ . '\register_block' );
