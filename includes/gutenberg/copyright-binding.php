<?php
/**
 * Registers block binding.
 *
 * @package mone
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the copyright block binding source.
 *
 * @return void
 */
function mone_copyright_register_block_bindings() {
	register_block_bindings_source(
		'mone/copyright',
		array(
			'label'              => _x( '&copy; YEAR', 'Label for the copyright placeholder in the editor', 'mone' ),
			'get_value_callback' => 'mone_copyright_binding',
		)
	);
}
add_action( 'init', 'mone_copyright_register_block_bindings' );

/**
 * Callback function for the copyright block binding source.
 *
 * @return string Copyright text.
 */
function mone_copyright_binding() {
	$copyright_text = wp_date( 'Y' );

	return $copyright_text;
}
