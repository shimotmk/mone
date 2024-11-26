<?php
/**
 * Registers the `mone/embed-title` block.
 *
 * @package mone
 */

namespace Mone_Theme\Embed_Title;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Embed Title callback
 *
 * @param array  $attributes Block attributes.
 * @param string $content Inner content.
 * @param object $block block.
 * @return string
 */
function title_render_callback( $attributes, $content, $block ) {
	if ( ! isset( $block->context['mone/embed-url'] ) ) {
		return null;
	}

	$data  = \Mone_Embed_Url::get_embed_data( $block->context['mone/embed-url'] );
	$title = ! empty( $data['title'] ) ? $data['title'] : false;

	if ( ! $title ) {
		return null;
	}

	$tag_name = 'h5';
	if ( isset( $attributes['level'] ) ) {
		$tag_name = 'h' . $attributes['level'];
	}

	if ( isset( $attributes['isLink'] ) && $attributes['isLink'] ) {
		$rel   = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';
		$title = sprintf(
			'<a href="%1$s" target="%2$s" %3$s>%4$s</a>',
			esc_url( $block->context['mone/embed-url'] ),
			esc_attr( $attributes['linkTarget'] ),
			$rel,
			$title
		);
	}

	$classes = array();
	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classes[] = 'has-link-color';
	}
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		$tag_name,
		$wrapper_attributes,
		$title
	);
}

/**
 * Register block
 *
 * @return void
 */
function register_block_embed_title() {
	register_block_type(
		__DIR__,
		array(
			'render_callback' => __NAMESPACE__ . '\title_render_callback',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_embed_title' );
