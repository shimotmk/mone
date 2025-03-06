<?php
/**
 * Stroke
 *
 * @package mone
 */

namespace Mone_Theme\Format_Library\Stroke;
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
	if ( null !== $block_content && strpos( $block_content, 'mone-has-stroke' ) !== false ) {
		static $is_rendered = false;
		if ( ! $is_rendered ) {
			$custom_css = '
				.mone-has-stroke {
					-webkit-text-stroke-width: var(--the-stroke-width, 1px);
					stroke-width: var(--the-stroke-width, 1px);
					-webkit-text-stroke-color: var(--the-stroke-color);
					stroke: var(--the-stroke-color);
				}
			';
			wp_register_style( 'mone-format-stroke-style', false );
			wp_enqueue_style( 'mone-format-stroke-style' );
			wp_add_inline_style( 'mone-format-stroke-style', escape_inline_style( $custom_css ) );

			$is_rendered = true;
		}
	}
	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_format_block_style' );
