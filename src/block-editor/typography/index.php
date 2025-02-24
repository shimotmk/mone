<?php
/**
 * Typography Extension
 *
 * @package mone
 */

namespace Mone_Theme\Typography_Extension;
use function Mone_Theme\Custom_Css\escape_inline_style;
use function Mone_Theme\UtilsFunc\exists_class_name;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render typography Extension
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string
 */
function render_typography_style( $block_content, $block ) {
	$class_name = $block['attrs']['className'] ?? '';
	if ( ! $class_name || ! exists_class_name( 'mone-one-line-center', $class_name ) ) {
		return $block_content;
	}

	if ( exists_class_name( 'mone-one-line-center', $class_name ) ) {
		static $is_rendered = false;
		if ( ! $is_rendered ) {
			$custom_css = '
				p.mone-one-line-center, .wp-block-heading.mone-one-line-center {
					margin-inline: auto;
					max-inline-size: max-content;
				}
			';
			wp_register_style( 'mone-typography-one-line-center-style', false );
			wp_enqueue_style( 'mone-typography-one-line-center-style' );
			wp_add_inline_style( 'mone-typography-one-line-center-style', escape_inline_style( $custom_css ) );

			$is_rendered = true;
		}
		return $block_content;
	}

	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_typography_style', 10, 2 );
