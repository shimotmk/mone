<?php
/**
 * Registers the `mone/embed-site-title` block.
 *
 * @package mone
 */

namespace Mone_Theme\Embed_Site_Title;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Embed Site Title render callback
 *
 * @param array  $attributes Block attributes.
 * @param string $content Inner content.
 * @param object $block block.
 * @return string
 */
function site_title_render_callback( $attributes, $content, $block ) {
	if ( ! isset( $block->context['mone/embed-url'] ) ) {
		return null;
	}

	$data       = \Mone_Embed_Url::get_embed_data( $block->context['mone/embed-url'] );
	$site_title = ! empty( $data['site_title'] ) ? $data['site_title'] : false;
	$domain     = ! empty( $data['domain'] ) ? $data['domain'] : false;

	if ( ! $site_title ) {
		return null;
	}

	$tag_name = 'p';
	if ( isset( $attributes['level'] ) ) {
		$tag_name = 0 === $attributes['level'] ? 'p' : 'h' . (int) $attributes['level'];
	}

	if ( ! empty( $domain ) && $attributes['isLink'] ) {
		$rel         = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';
		$link_target = ! empty( $attributes['linkTarget'] ) ? $attributes['linkTarget'] : '_self';

		$site_title = sprintf(
			'<a href="%1$s" target="%2$s" %3$s>%4$s</a>',
			esc_url( $domain ),
			esc_attr( $link_target ),
			$rel,
			esc_html( $site_title )
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
		$attributes['isLink'] ? $site_title : esc_html( $site_title )
	);
}

/**
 * Register block
 *
 * @return void
 */
function register_block_embed_site_title() {
	register_block_type(
		__DIR__,
		array(
			'render_callback' => __NAMESPACE__ . '\site_title_render_callback',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_embed_site_title' );
