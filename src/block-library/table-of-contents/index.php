<?php
/**
 * Registers the `mone/table-of-contents` block.
 *
 * @package mone
 */

namespace Mone_Theme\Table_Of_Contents;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * table of contents render callback
 *
 * @param array  $attributes Block attributes.
 * @param string $content Inner content.
 * @return string
 */
function table_of_contents_render_callback( $attributes, $content ) {

	$wrapper_attributes = get_block_wrapper_attributes();
	return sprintf(
		'<div %1$s></div>',
		$wrapper_attributes
	);
}


/**
 * Register block
 *
 * @return void
 */
function register_block_table_of_contents() {
	register_block_type(
		__DIR__,
		array(
			'render_callback' => __NAMESPACE__ . '\table_of_contents_render_callback',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_table_of_contents' );
