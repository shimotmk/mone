<?php
/**
 * Image
 *
 * @package mone
 */

namespace Mone_Theme\Format_Library\Image;
use function Mone_Theme\Custom_Css\escape_inline_style;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render_block_background_gradient
 *
 * @param string $block_content block_content.
 * @return string $block_content
 */
function render_format_block_style( $block_content ) {
	if ( strpos( $block_content, 'wp-image-' ) !== false ) {
		static $is_rendered = false;
		if ( ! $is_rendered ) {
			$custom_css = '
				:where(img[class*="wp-image-"]) {
					vertical-align: text-bottom;
				}
			';
			wp_register_style( 'mone-format-img-style', false );
			wp_enqueue_style( 'mone-format-img-style' );
			wp_add_inline_style( 'mone-format-img-style', escape_inline_style( $custom_css ) );

			$is_rendered = true;
		}
	}
	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_format_block_style' );
