<?php
/**
 * Details
 *
 * @package mone
 */

namespace Mone_Theme\Details;
use function Mone_Theme\UtilsFunc\mone_is_hex_color;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register block type args
 *
 * @param array  $args The block type registration arguments.
 * @param string $name The block type name including namespace.
 * @return array The updated arguments.
 */
function details_register_block_type_args( $args, $name ) {
	if ( 'core/details' === $name ) {
		$extra_supports = array(
			'__experimentalBorder' => array(
				'radius' => true,
				'color'  => true,
				'width'  => true,
				'style'  => true,
			),
		);

		$args['supports'] = array_merge( $args['supports'], $extra_supports );
	}

	return $args;
}
add_filter( 'register_block_type_args', __NAMESPACE__ . '\details_register_block_type_args', 10, 2 );


/**
 * Render_post_button
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 * @return string
 */
function render_block_details( $block_content, $parsed_block ) {
	$class_name = $parsed_block['attrs']['className'] ?? '';
	if ( ! $class_name || ! str_contains( $class_name, 'is-style-mone-details-icon' ) ) {
		return $block_content;
	}

	$summary_icon_url               = $parsed_block['attrs']['moneDetailsIcon'] ?? '';
	$summary_open_icon_url          = $parsed_block['attrs']['moneDetailsOpenIcon'] ?? '';
	$summary_icon_color_custom      = isset( $parsed_block['attrs']['moneIconGradient'] )
	? 'var(--wp--preset--gradient--' . $parsed_block['attrs']['moneIconGradient'] . ')'
	: ( $parsed_block['attrs']['moneIconCustomGradient'] ?? ( isset( $parsed_block['attrs']['moneIconColor'] ) && mone_is_hex_color( $parsed_block['attrs']['moneIconColor'] )
		? $parsed_block['attrs']['moneIconColor']
		: ( isset( $parsed_block['attrs']['moneIconColor'] ) ? 'var(--wp--preset--color--' . $parsed_block['attrs']['moneIconColor'] . ')' : '' ) ) );
	$summary_open_background_custom = isset( $parsed_block['attrs']['moneSummaryOpenGradient'] )
		? 'var(--wp--preset--gradient--' . $parsed_block['attrs']['moneSummaryOpenGradient'] . ')'
		: ( $parsed_block['attrs']['moneSummaryOpenCustomGradient'] ?? ( isset( $parsed_block['attrs']['moneSummaryOpenColor'] ) && mone_is_hex_color( $parsed_block['attrs']['moneSummaryOpenColor'] )
			? $parsed_block['attrs']['moneSummaryOpenColor']
			: ( isset( $parsed_block['attrs']['moneSummaryOpenColor'] ) ? 'var(--wp--preset--color--' . $parsed_block['attrs']['moneSummaryOpenColor'] . ')' : '' ) ) );
	$border_radius_top_left         = is_string( $parsed_block['attrs']['style']['border']['radius'] ?? null ) ? $parsed_block['attrs']['style']['border']['radius'] : ( $parsed_block['attrs']['style']['border']['radius']['topLeft'] ?? '' );
	$border_radius_top_right        = is_string( $parsed_block['attrs']['style']['border']['radius'] ?? null ) ? $parsed_block['attrs']['style']['border']['radius'] : ( $parsed_block['attrs']['style']['border']['radius']['topRight'] ?? '' );
	$border_radius_bottom_left      = is_string( $parsed_block['attrs']['style']['border']['radius'] ?? null ) ? $parsed_block['attrs']['style']['border']['radius'] : ( $parsed_block['attrs']['style']['border']['radius']['bottomLeft'] ?? '' );
	$border_radius_bottom_right     = is_string( $parsed_block['attrs']['style']['border']['radius'] ?? null ) ? $parsed_block['attrs']['style']['border']['radius'] : ( $parsed_block['attrs']['style']['border']['radius']['bottomRight'] ?? '' );

	$border_bottom_color = '';
	if ( isset( $parsed_block['attrs']['style']['border']['top']['color'] ) ) {
		$value            = $parsed_block['attrs']['style']['border']['top']['color'];
		$has_color_preset = str_contains( $value, 'var:preset|color|' );
		if ( $has_color_preset ) {
			$named_color_value = substr( $value, strrpos( $value, '|' ) + 1 );
			$value             = sprintf( 'var(--wp--preset--color--%s)', $named_color_value );
		}
		$border_bottom_color = $value;
	} else {
		$border_bottom_color = isset( $parsed_block['attrs']['borderColor'] )
			? 'var(--wp--preset--color--' . $parsed_block['attrs']['borderColor'] . ')'
			: ( isset( $parsed_block['attrs']['style']['border']['color'] )
				? $parsed_block['attrs']['style']['border']['color']
				: '' );
	}

	$border_bottom_style = isset( $parsed_block['attrs']['style']['border']['top']['style'] )
	? $parsed_block['attrs']['style']['border']['top']['style']
	: ( isset( $parsed_block['attrs']['style']['border']['style'] )
		? $parsed_block['attrs']['style']['border']['style']
		: ( isset( $parsed_block['attrs']['style']['border']['style'] )
			? $parsed_block['attrs']['style']['border']['style']
			: '' ) );
	$border_bottom_width = isset( $parsed_block['attrs']['style']['border']['top']['width'] )
	? $parsed_block['attrs']['style']['border']['top']['width']
	: ( isset( $parsed_block['attrs']['style']['border']['width'] )
		? $parsed_block['attrs']['style']['border']['width']
		: ( isset( $parsed_block['attrs']['style']['border']['width'] )
			? $parsed_block['attrs']['style']['border']['width']
			: '' ) );

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

		if ( ! empty( $summary_icon_url ) ) {
			$updated_style .= '--the-summary-icon-custom: url(' . $summary_icon_url . ');';
		}

		if ( ! empty( $summary_open_icon_url ) ) {
			$updated_style .= '--the-summary-open-icon-custom: url(' . $summary_open_icon_url . ');';
		}

		$has_named_font_size = ! empty( $parsed_block['attrs']['fontSize'] );
		if ( $has_named_font_size ) {
			$updated_style .= '--the-summary-icon-size: var(--wp--preset--font-size--' . $parsed_block['attrs']['fontSize'] . ');';
		}
		if ( ! empty( $parsed_block['attrs']['style']['typography']['fontSize'] ) ) {
			$typography_styles = wp_get_typography_font_size_value(
				array(
					'size' => $parsed_block['attrs']['style']['typography']['fontSize'],
				)
			);
			$updated_style    .= '--the-summary-icon-size: ' . $typography_styles . ';';
		}

		if ( ! empty( $summary_open_background_custom ) ) {
			$updated_style .= '--the-summary-open-background-custom: ' . $summary_open_background_custom . ';';
		}

		if ( ! empty( $summary_icon_color_custom ) ) {
			$updated_style .= '--the-summary-icon-color-custom: ' . $summary_icon_color_custom . ';';
		}

		if ( ! empty( $border_radius_top_left ) ) {
			$updated_style .= '--the-border-radius-top-left-custom: ' . $border_radius_top_left . ';';
		}

		if ( ! empty( $border_radius_top_right ) ) {
			$updated_style .= '--the-border-radius-top-right-custom: ' . $border_radius_top_right . ';';
		}

		if ( ! empty( $border_radius_bottom_left ) ) {
			$updated_style .= '--the-border-radius-bottom-left-custom: ' . $border_radius_bottom_left . ';';
		}

		if ( ! empty( $border_radius_bottom_right ) ) {
			$updated_style .= '--the-border-radius-bottom-right-custom: ' . $border_radius_bottom_right . ';';
		}

		if ( ! empty( $border_bottom_color ) ) {
			$updated_style .= '--the-border-bottom-color-custom: ' . $border_bottom_color . ';';
		}

		if ( ! empty( $border_bottom_style ) ) {
			$updated_style .= '--the-border-bottom-style-custom: ' . $border_bottom_style . ';';
		}

		if ( ! empty( $border_bottom_width ) ) {
			$updated_style .= '--the-border-bottom-width-custom: ' . $border_bottom_width . ';';
		}

		$p->set_attribute( 'style', $updated_style );

	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/details', __NAMESPACE__ . '\render_block_details', 10, 2 );
