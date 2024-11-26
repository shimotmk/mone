<?php
/**
 * Template_Part
 *
 * @package mone
 */

namespace Mone_Theme\Template_Part;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add supports
 *
 * @param array  $args args.
 * @param string $name name.
 */
function template_register_block_type_args( $args, $name ) {
	// https://github.com/WordPress/gutenberg/pull/63540 .
	if ( 'core/template-part' === $name ) {
		$extra_supports = array(
			'position' => array(
				'sticky' => true,
			),
			'spacing'  => array(
				'margin' => true,
			),
		);

		$args['supports'] = array_merge( $args['supports'], $extra_supports );
	}

	return $args;
}
add_filter( 'register_block_type_args', __NAMESPACE__ . '\template_register_block_type_args', 10, 2 );

/**
 * Render Group
 *
 * @param string $block_content block_content.
 */
function render_block_cote_template_part( $block_content ) {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $block_content;
	}

	// template-partの中身にタグが存在しないときはmarginを表示させたくないのクラスを追加.
	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag() ) {
		$p->set_bookmark( 'mone-bookmark' );
		if ( ! $p->next_tag() ) {
			$p->seek( 'mone-bookmark' );
			$p->add_class( 'mone_empty_tag' );
		}
	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/template-part', __NAMESPACE__ . '\render_block_cote_template_part' );
