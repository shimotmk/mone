<?php
/**
 * Separator
 *
 * @package mone
 */

namespace Mone_Theme\Separator;
use function Mone_Theme\UtilsFunc\exists_class_name;

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
function separator_register_block_type_args( $args, $name ) {
	if ( 'core/separator' === $name ) {
		$extra_supports = array(
			'__experimentalBorder' => array(
				'radius'                        => true,
				'color'                         => false,
				'width'                         => false,
				'style'                         => true,
				'__experimentalDefaultControls' => array(
					'radius' => true,
					'color'  => false,
					'width'  => false,
					'style'  => true,
				),
			),
		);

		$args['supports'] = array_merge( $args['supports'], $extra_supports );
	}

	return $args;
}
add_filter( 'register_block_type_args', __NAMESPACE__ . '\separator_register_block_type_args', 10, 2 );

/**
 * Render_post_button
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 *
 * @return string
 */
function render_block_separator( $block_content, $parsed_block ) {
	$class_name = isset( $parsed_block['attrs']['className'] )
	? $parsed_block['attrs']['className'] : '';
	if ( ! exists_class_name( 'mone-separator', $class_name ) ) {
		return $block_content;
	}

	$separator_gradient_color = isset( $parsed_block['attrs']['gradient'] )
	? 'var(--wp--preset--gradient--' . $parsed_block['attrs']['gradient'] . ')'
	: $parsed_block['attrs']['style']['color']['gradient'] ?? '';
	$height                   = isset( $parsed_block['attrs']['moneSeparatorHeight'] )
	? $parsed_block['attrs']['moneSeparatorHeight'] : '';
	$width                    = isset( $parsed_block['attrs']['moneSeparatorWidth'] )
	? $parsed_block['attrs']['moneSeparatorWidth'] : '';
	$size                     = isset( $parsed_block['attrs']['moneSeparatorSize'] )
	? $parsed_block['attrs']['moneSeparatorSize'] : '';

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

		if ( ! exists_class_name( 'is-style-dots', $class_name ) ) {
			if ( $separator_gradient_color ) {
				$updated_style .= 'background:' . $separator_gradient_color . ';';
				$updated_style .= 'border-width:0px;';
			}
			if ( $width ) {
				$updated_style .= 'width:' . $width . ';';
			}
			if ( $height ) {
				$updated_style .= 'height:' . $height . ';';
			} else {
				$updated_style .= 'height:1px;';
			}
		} elseif ( exists_class_name( 'is-style-dots', $class_name ) ) {
			if ( $separator_gradient_color ) {
				$updated_style .= '--the-before-gradient-color:' . $separator_gradient_color . ';';
			}
			if ( $size ) {
				$updated_style .= '--the-before-font-size:' . $size . ';';
			}
		}
	}

	$p->set_attribute( 'style', $updated_style );
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/separator', __NAMESPACE__ . '\render_block_separator', 10, 2 );
