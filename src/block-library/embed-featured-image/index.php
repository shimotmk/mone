<?php
/**
 * Registers the `mone/embed-featured-image` block.
 *
 * @package mone
 */

namespace Mone_Theme\Embed_Featured_Image;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Embed Featured Image render callback
 *
 * @param array  $attributes Block attributes.
 * @param string $content Inner content.
 * @param object $block block.
 * @return string
 */
function featured_image_render_callback( $attributes, $content, $block ) {
	if ( ! isset( $block->context['mone/embed-url'] ) ) {
		return '';
	}

	$data          = \Mone_Embed_Url::get_embed_data( $block->context['mone/embed-url'] );
	$thumbnail_url = ! empty( $data['featured_image'] ) ? $data['featured_image'] : false;

	if ( ! $thumbnail_url ) {
		return null;
	}

	$is_link        = isset( $attributes['isLink'] ) && $attributes['isLink'];
	$attr           = get_block_core_post_featured_image_border_attributes( $attributes );
	$overlay_markup = get_block_core_post_featured_image_overlay_element_markup( $attributes );

	$extra_styles = '';

	// Aspect ratio with a height set needs to override the default width/height.
	if ( ! empty( $attributes['aspectRatio'] ) ) {
		$extra_styles .= 'width:100%;height:100%;';
	} elseif ( ! empty( $attributes['height'] ) ) {
		$extra_styles .= "height:{$attributes['height']};";
	}

	if ( ! empty( $attributes['scale'] ) ) {
		$extra_styles .= "object-fit:{$attributes['scale']};";
	}

	if ( ! empty( $attributes['style']['shadow'] ) ) {
		$shadow_styles = wp_style_engine_get_styles( array( 'shadow' => $attributes['style']['shadow'] ) );

		if ( ! empty( $shadow_styles['css'] ) ) {
			$extra_styles .= $shadow_styles['css'];
		}
	}

	if ( ! empty( $extra_styles ) ) {
		$attr['style'] = empty( $attr['style'] ) ? $extra_styles : $attr['style'] . $extra_styles;
	}

	$attr          = array_map( 'esc_attr', $attr );
	$favicon_image = rtrim( "<img src='$thumbnail_url'" );

	foreach ( $attr as $name => $value ) {
		$favicon_image .= " $name=" . '"' . $value . '"';
	}

	$favicon_image .= ' />';

	if ( $is_link ) {
		$link_target   = $attributes['linkTarget'];
		$rel           = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';
		$height        = ! empty( $attributes['height'] ) ? 'style="' . esc_attr( safecss_filter_attr( 'height:' . $attributes['height'] ) ) . '"' : '';
		$favicon_image = sprintf(
			'<a href="%1$s" target="%2$s" %3$s %4$s>%5$s%6$s</a>',
			$block->context['mone/embed-url'],
			esc_attr( $link_target ),
			$rel,
			$height,
			$favicon_image,
			$overlay_markup
		);
	} else {
		$favicon_image = $favicon_image . $overlay_markup;
	}

	$aspect_ratio = ! empty( $attributes['aspectRatio'] )
		? esc_attr( safecss_filter_attr( 'aspect-ratio:' . $attributes['aspectRatio'] ) ) . ';'
		: '';
	$width        = ! empty( $attributes['width'] )
		? esc_attr( safecss_filter_attr( 'width:' . $attributes['width'] ) ) . ';'
		: '';
	$height       = ! empty( $attributes['height'] )
		? esc_attr( safecss_filter_attr( 'height:' . $attributes['height'] ) ) . ';'
		: '';
	if ( ! $height && ! $width && ! $aspect_ratio ) {
		$wrapper_attributes = get_block_wrapper_attributes();
	} else {
		$wrapper_attributes = get_block_wrapper_attributes( array( 'style' => $aspect_ratio . $width . $height ) );
	}
	return "<figure {$wrapper_attributes}>{$favicon_image}</figure>";
}

/**
 * Register block
 *
 * @return void
 */
function register_block_embed_featured_image() {
	register_block_type(
		__DIR__,
		array(
			'render_callback' => __NAMESPACE__ . '\featured_image_render_callback',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_embed_featured_image' );
