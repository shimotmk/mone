<?php
/**
 * Caption Extension
 *
 * @package mone
 */

namespace Mone_Theme\Caption_Extension;
use function Mone_Theme\Custom_Css\escape_inline_style;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render caption Extension
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string
 */
function render_caption_style( $block_content, $block ) {
	$class_name = $block['attrs']['className'] ?? '';
	if ( empty( $class_name ) ) {
		return $block_content;
	}

	if ( ! str_contains( $class_name, 'mone-caption-left' ) &&
		! str_contains( $class_name, 'mone-caption-center' ) &&
		! str_contains( $class_name, 'mone-caption-one-line-center' ) &&
		! str_contains( $class_name, 'mone-caption-right' ) ) {
		return $block_content;
	}

	static $is_rendered_base = false;
	if ( ! $is_rendered_base ) {
		$base_css = '
			.mone-caption-left {
				> .wp-element-caption {
					text-align: left;
				}
			}
			.mone-caption-center {
				> .wp-element-caption {
					text-align: center;
				}
			}
			.mone-caption-right {
				> .wp-element-caption {
					text-align: right;
				}
			}
			.mone-caption-one-line-center {
				> .wp-element-caption {
					margin-inline: auto;
					max-inline-size: max-content;
					text-align: initial;
				}
			}
		';
		wp_register_style( 'mone-caption-base-style', false );
		wp_enqueue_style( 'mone-caption-base-style' );
		wp_add_inline_style( 'mone-caption-base-style', escape_inline_style( $base_css ) );
		$is_rendered_base = true;
	}

	if ( 'core/gallery' === $block['blockName'] ) {
		static $is_rendered_gallery = false;
		if ( ! $is_rendered_gallery ) {
			$base_css = '
			.wp-block-gallery.has-nested-images figure.wp-block-image.mone-caption-one-line-center {
				&::before {
					background: linear-gradient(0deg, #0006, #0000);
				}
				> figcaption.wp-element-caption {
					background: initial;
					margin-inline: auto;
					max-inline-size: max-content;
					text-align: initial;
					word-break: break-word;
				}
			}

			.wp-block-gallery.has-nested-images.mone-caption-left {
				> .wp-element-caption {
					text-align: left;
				}
			}
			.wp-block-gallery.has-nested-images.mone-caption-center {
				> .wp-element-caption {
					text-align: center;
				}
			}
			.wp-block-gallery.has-nested-images.mone-caption-right {
				> .wp-element-caption {
					text-align: right;
				}
			}
		';
			wp_register_style( 'mone-caption-gallery-style', false );
			wp_enqueue_style( 'mone-caption-gallery-style' );
			wp_add_inline_style( 'mone-caption-gallery-style', escape_inline_style( $base_css ) );
			$is_rendered_gallery = true;
		}
	}

	if ( 'core/quote' === $block['blockName'] ) {
		static $is_rendered_quote = false;
		if ( ! $is_rendered_quote ) {
			$base_css = '
			.wp-block-quote {
				&.mone-caption-left {
					cite {
						justify-content: start;
					}
				}
				&.mone-caption-center {
					cite {
						text-align: center;
						justify-content: center;
					}
				}
				.mone-caption-one-line-center {
					cite {
						justify-content: center;
					}
				}
				&.mone-caption-right {
					cite {
						text-align: right;
						justify-content: flex-end;
					}
				}
			}
		';
			wp_register_style( 'mone-caption-quote-style', false );
			wp_enqueue_style( 'mone-caption-quote-style' );
			wp_add_inline_style( 'mone-caption-quote-style', escape_inline_style( $base_css ) );
			$is_rendered_quote = true;
		}
	}

	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_caption_style', 10, 2 );
