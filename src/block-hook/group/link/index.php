<?php
/**
 * Group Link
 *
 * @package mone
 */

namespace Mone_Theme\Group\Link;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if the given color is a hex color.
 *
 * @param string $color The color to check.
 * @return bool True if the color is a hex color, false otherwise.
 */
function mone_is_hex_color( $color ) {
	return is_string( $color ) && strpos( $color, '#' ) === 0;
}

/**
 * Render the linked group block on the frontend.
 *
 * @param string $block_content The original block content.
 * @param array  $block         The block attributes.
 *
 * @return string Modified block content.
 */
function groups_render_block( $block_content, $block ) {
	if ( ! isset( $block['attrs']['href'] ) ) {
		return $block_content;
	}

	$href                   = $block['attrs']['href'] ?? '';
	$link_target            = $block['attrs']['linkTarget'] ?? '_self';
	$hover_background_color = $block['attrs']['moneHoverBackgroundColor'] ?? '';
	$link_rel               = '_blank' === $link_target ? 'noopener noreferrer' : 'follow';

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag() ) {

		if ( ! empty( $hover_background_color ) ) {
			$existing_style = $p->get_attribute( 'style' );
			$updated_style  = '';
			if ( ! empty( $existing_style ) ) {
				$updated_style = $existing_style;
				if ( ! str_ends_with( $existing_style, ';' ) ) {
					$updated_style .= ';';
				}
			}

			$hover_background_color = mone_is_hex_color( $hover_background_color ) ? $hover_background_color : 'var(--wp--preset--color--' . $hover_background_color . ')';
			$updated_style         .= '--mone--hover-background-color:' . $hover_background_color . ';';
			$p->set_attribute( 'style', $updated_style );
		}

		$p->add_class( 'mone-is-linked' );
	}
	$block_content = $p->get_updated_html();

	$link_markup = sprintf(
		'<a class="wp-block-group__link" href="%1$s" target="%2$s" rel="%3$s" aria-hidden="true" tabindex="-1">&nbsp;</a>',
		esc_url( $href ),
		esc_attr( $link_target ),
		esc_attr( $link_rel )
	);

	$block_content = preg_replace(
		'/^\s*<(\w+)([^>]*)>/m',
		'<$1$2>' . $link_markup,
		$block_content,
		1
	);

	return $block_content;
}
add_filter( 'render_block_core/group', __NAMESPACE__ . '\groups_render_block', 10, 2 );
