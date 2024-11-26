<?php
/**
 * Registers the `mone/embed-site-logo` block.
 *
 * @package mone
 */

namespace Mone_Theme\Embed_Site_Logo;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Embed Site Logo render callback
 *
 * @param array  $attributes Block attributes.
 * @param string $content Inner content.
 * @param object $block block.
 * @return string
 */
function site_logo_render_callback( $attributes, $content, $block ) {
	if ( ! isset( $block->context['mone/embed-url'] ) ) {
		return '';
	}

	$data          = \Mone_Embed_Url::get_embed_data( $block->context['mone/embed-url'] );
	$site_logo_url = ! empty( $data['site_logo'] ) ? $data['site_logo'] : false;
	$domain        = ! empty( $data['domain'] ) ? $data['domain'] : false;

	if ( ! $site_logo_url ) {
		return null;
	}

	$is_link = isset( $attributes['isLink'] ) && $attributes['isLink'];
	$attr    = get_block_core_post_featured_image_border_attributes( $attributes );

	$attr          = array_map( 'esc_attr', $attr );
	$favicon_image = rtrim( "<img src='$site_logo_url'" );

	foreach ( $attr as $name => $value ) {
		$favicon_image .= " $name=" . '"' . $value . '"';
	}

	$favicon_image .= ' />';

	if ( ! empty( $domain ) && $is_link ) {
		$link_target   = $attributes['linkTarget'];
		$rel           = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';
		$favicon_image = sprintf(
			'<a href="%1$s" target="%2$s" %3$s>%4$s</a>',
			esc_url( $domain ),
			esc_attr( $link_target ),
			$rel,
			$favicon_image
		);
	} else {
		$favicon_image = $favicon_image;
	}

	$wrapper_attributes = get_block_wrapper_attributes();
	return "<figure {$wrapper_attributes}>{$favicon_image}</figure>";
}

/**
 * Register block
 *
 * @return void
 */
function register_block_embed_site_logo() {
	register_block_type(
		__DIR__,
		array(
			'render_callback' => __NAMESPACE__ . '\site_logo_render_callback',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_embed_site_logo' );
