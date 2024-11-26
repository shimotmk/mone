<?php
/**
 * List
 *
 * @package mone
 */

namespace Mone_Theme\List_Item_Block;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add supports
 *
 * @param array  $args args.
 * @param string $name name.
 */
function list_register_block_type_args( $args, $name ) {
	// https://github.com/WordPress/gutenberg/pull/63540 .
	if ( 'core/list-item' === $name ) {
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
add_filter( 'register_block_type_args', __NAMESPACE__ . '\list_register_block_type_args', 10, 2 );
