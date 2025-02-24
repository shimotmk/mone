<?php
/**
 * Post_Template
 *
 * @package mone
 */

namespace Mone_Theme\Post_Template;
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
function post_template_register_block_type_args( $args, $name ) {
	if ( 'core/post-template' === $name ) {
		$extra_supports = array(
			'spacing'              => array(
				'padding' => true,
			),
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
add_filter( 'register_block_type_args', __NAMESPACE__ . '\post_template_register_block_type_args', 10, 2 );

/**
 * Add custom class to the block
 *
 * @param string $block_content The block content about to be rendered.
 * @param array  $block         The block attributes.
 * @return string The updated block content.
 */
function post_template_render_block( $block_content, $block ) {
	$class_name = $block['attrs']['className'] ?? '';
	if ( ! $class_name || ! exists_class_name( 'mone-scroll', $class_name ) ) {
		return $block_content;
	}

	$scroll_snap       = $block['attrs']['moneScrollSnap'] ?? null;
	$scroll_snap_align = $block['attrs']['moneScrollSnapAlign'] ?? null;

	$p = new \WP_HTML_Tag_Processor( $block_content );

	if ( $p->next_tag( 'ul' ) ) {

		if ( 'snap' === $scroll_snap ) {
			$p->add_class( 'mone-scroll-snap' );

			$valid_alignments = array( 'start', 'center', 'end' );
			if ( in_array( $scroll_snap_align, $valid_alignments, true ) ) {
				$p->add_class( 'mone-scroll-snap-' . $scroll_snap_align );
			} else {
				$p->add_class( 'mone-scroll-snap-center' );
			}
		}

		$gap                  = isset( $block['attrs']['style']['spacing']['blockGap'] ) ? $block['attrs']['style']['spacing']['blockGap'] : '1.2rem';
		$column_count         = isset( $block['attrs']['layout']['columnCount'] ) ? $block['attrs']['layout']['columnCount'] : null;
		$minimum_column_width = isset( $block['attrs']['layout']['minimumColumnWidth'] ) ? $block['attrs']['layout']['minimumColumnWidth'] : null;

		$existing_style = $p->get_attribute( 'style' );
		$updated_style  = '';
		if ( ! empty( $existing_style ) ) {
			$updated_style = $existing_style;
			if ( ! str_ends_with( $existing_style, ';' ) ) {
				$updated_style .= ';';
			}
		}

		$gap = is_string( $gap ) ? $gap : '';
		$gap = $gap && preg_match( '%[\\\(&=}]|/\*%', $gap ) ? null : $gap;
		if ( is_string( $gap ) && str_contains( $gap, 'var:preset|spacing|' ) ) {
			$index_to_splice = strrpos( $gap, '|' ) + 1;
			$slug            = _wp_to_kebab_case( substr( $gap, $index_to_splice ) );
			$gap             = "( var(--wp--preset--spacing--$slug) )";
		}

		if ( null !== $column_count ) {
			// ( カラム数 - 1  ) × blockGap
			$updated_style .= '--mone--the--min--width:calc(( 100% - ((' . $column_count . ' - 1) * ' . $gap . ') ) / ' . $column_count . ');';
		}

		if ( null !== $minimum_column_width ) {
			$updated_style .= '--mone--the--min--width:' . $minimum_column_width . ';';
		}

		$p->set_attribute( 'style', $updated_style );

	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/post-template', __NAMESPACE__ . '\post_template_render_block', 10, 2 );
