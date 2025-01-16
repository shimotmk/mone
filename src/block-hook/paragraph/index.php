<?php
/**
 * Paragraph
 *
 * @package mone
 */

namespace Mone_Theme\Paragraph;
use function Mone_Theme\UtilsFunc\mone_is_hex_color;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render block post date
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 * @param object $block block.
 *
 * @return string
 */
function render_block_paragraph( $block_content, $parsed_block ) {
	$alert_icon_url          = $parsed_block['attrs']['moneAlertIcon'] ?? '';
	$alert_icon_color_custom = isset( $parsed_block['attrs']['moneIconGradient'] )
	? 'var(--wp--preset--gradient--' . $parsed_block['attrs']['moneIconGradient'] . ')'
	: ( $parsed_block['attrs']['moneIconCustomGradient'] ?? ( isset( $parsed_block['attrs']['moneAlertIconColor'] ) && mone_is_hex_color( $parsed_block['attrs']['moneAlertIconColor'] )
		? $parsed_block['attrs']['moneAlertIconColor']
		: ( isset( $parsed_block['attrs']['moneAlertIconColor'] ) ? 'var(--wp--preset--color--' . $parsed_block['attrs']['moneAlertIconColor'] . ')' : '' ) ) );

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag() ) {

		$existing_style = $p->get_attribute( 'style' );
		$updated_style  = '';
		if ( ! empty( $existing_style ) ) {
			$updated_style = $existing_style;
			if ( ! str_ends_with( $existing_style, ';' ) ) {
				$updated_style .= ';';
			}
		}

		if ( ! empty( $alert_icon_url ) ) {
			$updated_style .= '--the-alert-icon-custom: url(' . $alert_icon_url . ');';
		}
		if ( ! empty( $alert_icon_color_custom ) ) {
			$updated_style .= '--the-alert-icon-color-custom: ' . $alert_icon_color_custom . ';';
		}

		$has_named_font_size = ! empty( $parsed_block['attrs']['fontSize'] );
		if ( $has_named_font_size ) {
			$updated_style .= '--the-alert-font-size: var(--wp--preset--font-size--' . $parsed_block['attrs']['fontSize'] . ');';
		}
		// custom font size
		if ( ! empty( $parsed_block['attrs']['style']['typography']['fontSize'] ) ) {
			$typography_styles = wp_get_typography_font_size_value(
				array(
					'size' => $parsed_block['attrs']['style']['typography']['fontSize'],
				)
			);
			$updated_style    .= '--the-alert-font-size: ' . $typography_styles . ';';
		}

		$p->set_attribute( 'style', $updated_style );
	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/paragraph', __NAMESPACE__ . '\render_block_paragraph', 10, 2 );
