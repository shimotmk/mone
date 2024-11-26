<?php
/**
 * Query_pagination_previous
 *
 * @package mone
 */

namespace Mone_Theme\Query_Pagination_Previous;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add supports
 *
 * @param array  $args args.
 * @param string $name name.
 */
function query_pagination_previous_register_block_type_args( $args, $name ) {
	if ( 'core/query-pagination-previous' === $name ) {
		$extra_supports = array(
			'color'                => array(
				'text' => true,
			),
			'spacing'              => array(
				'margin'  => true,
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
add_filter( 'register_block_type_args', __NAMESPACE__ . '\query_pagination_previous_register_block_type_args', 10, 2 );
