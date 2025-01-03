<?php
/**
 * Icon
 *
 * @package mone
 */

namespace Mone_Theme\Format_Library\Icon;
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
	if ( strpos( $block_content, 'mone-inline-icon' ) !== false ) {
		static $is_rendered = false;
		if ( ! $is_rendered ) {
			$custom_css = '
				.mone-inline-icon {
					display: inline-block;
					margin-left: 0.1em;
					margin-right: 0.1em;
					min-width: 1em;
					position: relative;
					pointer-events: none;
				}

				.mone-inline-icon::after {
					background: var(--the-gradient-color-for-text, currentcolor);
					content: "";
					display: block;
					height: 100%;
					left: 0;
					mask-image: var(--the-icon-svg);
					mask-position: center center;
					mask-repeat: no-repeat;
					mask-size: contain;
					position: absolute;
					top: 0;
					width: 100%;
					box-sizing: inherit;
				}
			';
			wp_register_style( 'mone-format-mone-inline-icon-style', false );
			wp_enqueue_style( 'mone-format-mone-inline-icon-style' );
			wp_add_inline_style( 'mone-format-mone-inline-icon-style', escape_inline_style( $custom_css ) );

			$is_rendered = true;
		}
	}
	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_format_block_style' );