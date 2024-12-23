<?php
/**
 * Registers the `mone/table-of-contents` block.
 *
 * @package mone
 */

namespace Mone_Theme\Table_Of_Contents;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * table of contents render callback
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function table_of_contents_render_callback( $attributes ) {
	$max_height                  = $attributes['maxHeight'] ?? false;
	$deactivate_text_color       = isset( $attributes['deactivateTextColor'] ) ? $attributes['deactivateTextColor'] : null;
	$custom_deactivate_textColor = isset( $attributes['customDeactivateTextColor'] ) ? $attributes['customDeactivateTextColor'] : null;
	$before_color                = isset( $attributes['beforeColor'] ) ? $attributes['beforeColor'] : null;
	$custom_before_color         = isset( $attributes['customBeforeColor'] ) ? $attributes['customBeforeColor'] : null;
	$before_deactivate_color                = isset( $attributes['beforeDeactivateColor'] ) ? $attributes['beforeDeactivateColor'] : null;
	$custom_before_deactivate_color         = isset( $attributes['customBeforeDeactivateColor'] ) ? $attributes['customBeforeDeactivateColor'] : null;
	$line_color                = isset( $attributes['lineColor'] ) ? $attributes['lineColor'] : null;
	$custom_line_color         = isset( $attributes['customLineColor'] ) ? $attributes['customLineColor'] : null;
	$class_name  = $attributes['className'] ?? '';
	$class_array = explode( ' ', $class_name );

	$classes         = array();
	$style_attribute = '';
	if ( ! in_array( 'is-style-mone-default-toc', $class_array, true ) ) {
        $classes[] = 'mone-toc';
    }
	if ( $max_height ) {
		$classes[]        = 'has-max-height';
		$style_attribute .= 'max-height:' . $max_height . '; overflow-y: auto;';
	}
	if ( in_array( 'mone-is-scroll-animation', $class_array, true ) ) {
		if ( ! empty( $deactivate_text_color ) ) {
			$classes[]        = 'has-deactivate-text-color';
			$style_attribute .= '--the-deactivate-text-color:var(--wp--preset--color--' . $deactivate_text_color . ');';
		}
		if ( ! empty( $custom_deactivate_textColor ) ) {
			$classes[]        = 'has-deactivate-text-color';
			$style_attribute .= '--the-deactivate-text-color:' . $custom_deactivate_textColor . ';';
		}
    }
	if ( ! empty( $before_color ) ) {
		$classes[]        = 'has-before-color';
		$style_attribute .= '--the-before-color:var(--wp--preset--color--' . $before_color . ');';
	}
	if ( ! empty( $custom_before_color ) ) {
		$classes[]        = 'has-before-color';
		$style_attribute .= '--the-before-color:' . $custom_before_color . ';';
	}
	if ( in_array( 'mone-is-scroll-animation', $class_array, true ) ) {
		if ( ! empty( $before_deactivate_color ) ) {
			$classes[]        = 'has-before-deactivate-color';
			$style_attribute .= '--the-before-deactivate-color:var(--wp--preset--color--' . $before_deactivate_color . ');';
		}
		if ( ! empty( $custom_before_deactivate_color ) ) {
			$classes[]        = 'has-before-deactivate-color';
			$style_attribute .= '--the-before-deactivate-color:' . $custom_before_deactivate_color . ';';
		}
	}
	if ( ! empty( $line_color ) ) {
		$classes[]        = 'has-line-color';
		$style_attribute .= '--the-line-color:var(--wp--preset--color--' . $line_color . ');';
	}
	if ( ! empty( $custom_line_color ) ) {
		$classes[]        = 'has-line-color';
		$style_attribute .= '--the-line-color:' . $custom_line_color . ';';
	}

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => implode( ' ', $classes ),
			'style' => $style_attribute,
		)
	);
	return sprintf(
		'<div %1$s></div>',
		$wrapper_attributes
	);
}


/**
 * Register block
 *
 * @return void
 */
function register_block_table_of_contents() {

	register_block_style(
		'mone/table-of-contents',
		array(
			'name'       => 'mone-default-toc',
			'label'      => __( 'Mone table of contents', 'mone' ),
			'style_data' => array(
				'css'        => '',
			),
		)
	);

	register_block_type(
		__DIR__,
		array(
			'render_callback' => __NAMESPACE__ . '\table_of_contents_render_callback',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_table_of_contents' );
