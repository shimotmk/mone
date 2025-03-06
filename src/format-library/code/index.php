<?php
/**
 * Code
 *
 * @package mone
 */

namespace Mone_Theme\Format_Library\Code;
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
	if ( null !== $block_content && strpos( $block_content, 'code' ) !== false ) {
		static $is_rendered = false;
		if ( ! $is_rendered ) {
			$custom_css = '
				:where(code:not(.prism-code,.block-editor-rich-text__editable)) {
					padding: 2px 4px;
					font-size: 90%;
					color: #c7254e;
					background-color: #f9f2f4;
					border-radius: 4px;
				}
			';
			wp_register_style( 'mone-format-code-style', false );
			wp_enqueue_style( 'mone-format-code-style' );
			wp_add_inline_style( 'mone-format-code-style', escape_inline_style( $custom_css ) );

			$is_rendered = true;
		}
	}
	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_format_block_style' );
