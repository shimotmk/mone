<?php
/**
 * Query_pagination
 *
 * @package mone
 */

namespace Mone_Theme\Query_Pagination;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add supports
 *
 * @param array  $args args.
 * @param string $name name.
 */
function query_pagination_register_block_type_args( $args, $name ) {
	if ( 'core/query-pagination' === $name ) {
		$extra_supports = array(
			'spacing' => array(
				'margin'   => true,
				'padding'  => true,
				'blockGap' => true,
			),
		);

		$args['supports'] = array_merge( $args['supports'], $extra_supports );
	}

	return $args;
}
add_filter( 'register_block_type_args', __NAMESPACE__ . '\query_pagination_register_block_type_args', 10, 2 );
