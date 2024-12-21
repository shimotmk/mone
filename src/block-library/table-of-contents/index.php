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

function mone_padding_attributes_to_value( $padding ) {
	if ( is_string( $padding ) && str_contains( $padding, 'var:preset|spacing|' ) ) {
		$index_to_splice = strrpos( $padding, '|' ) + 1;
		$slug            = _wp_to_kebab_case( substr( $padding, $index_to_splice ) );
		$padding       = "var(--wp--preset--spacing--$slug)";
	}
	return $padding;
}

/**
 * table of contents render callback
 *
 * @param array  $attributes Block attributes.
 * @return string
 */
function table_of_contents_render_callback( $attributes ) {
	$padding_top = isset( $attributes['style']['spacing']['padding']['top'] ) ? mone_padding_attributes_to_value( $attributes['style']['spacing']['padding']['top'] ) : 0;
	$padding_bottom = isset( $attributes['style']['spacing']['padding']['bottom'] ) ? mone_padding_attributes_to_value( $attributes['style']['spacing']['padding']['bottom'] ) : 0;
	$max_height = $attributes['maxHeight'] ?? false;

	$style_attribute = '';
	$classes = array();
	if ( $max_height ) {
		$style_attribute .= '--the-max-height: calc(' . $max_height .' - ' . $padding_top . ' - ' . $padding_bottom . ');';
	}
	if ( $max_height ) {
		$classes[] = 'has-max-height';
	}

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => implode( ' ', $classes ),
			'style' => $style_attribute,
		)
	);
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