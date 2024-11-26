<?php
/**
 * Post-title
 *
 * @package mone
 */

namespace Mone_Theme\Post_Title;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add supports
 *
 * @param array  $args args.
 * @param string $name name.
 */
function post_title_register_block_type_args( $args, $name ) {
	// https://github.com/WordPress/gutenberg/pull/63540 .
	if ( 'core/post-title' === $name ) {
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
add_filter( 'register_block_type_args', __NAMESPACE__ . '\post_title_register_block_type_args', 10, 2 );
