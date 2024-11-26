<?php
/**
 * Registers the `mone/embed-excerpt` block.
 *
 * @package mone
 */

namespace Mone_Theme\Embed_Excerpt;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Embed excerpt render callback
 *
 * @param array  $attributes Block attributes.
 * @param string $content Inner content.
 * @param object $block block.
 * @return string
 */
function excerpt_render_callback( $attributes, $content, $block ) {
	if ( ! isset( $block->context['mone/embed-url'] ) ) {
		return null;
	}

	$data    = \Mone_Embed_Url::get_embed_data( $block->context['mone/embed-url'] );
	$excerpt = ! empty( $data['excerpt'] ) ? $data['excerpt'] : false;

	if ( ! $excerpt ) {
		return null;
	}

	if ( isset( $attributes['excerptLength'] ) ) {
		$excerpt = wp_trim_words( $excerpt, $attributes['excerptLength'] );
	}

	$wrapper_attributes = get_block_wrapper_attributes();

	$content = '<p class="wp-block-mone-embed-excerpt__excerpt">' . $excerpt . '</p>';
	return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $content );
}

/**
 * Register block
 *
 * @return void
 */
function register_block_embed_excerpt() {
	register_block_type(
		__DIR__,
		array(
			'render_callback' => __NAMESPACE__ . '\excerpt_render_callback',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_embed_excerpt' );
