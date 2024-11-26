<?php
/**
 * Quote
 *
 * @package mone
 */

namespace Mone_Theme\Quote;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add supports
 *
 * @param array  $args args.
 * @param string $name name.
 */
function quote_register_block_type_args( $args, $name ) {
	if ( 'core/quote' === $name ) {
		$extra_attributes = array(
			'background' => array(
				'backgroundImage' => true,
				'backgroundSize'  => true,
			),
		);

		$args['supports'] = array_merge( $args['supports'], $extra_attributes );
	}

	return $args;
}
add_filter( 'register_block_type_args', __NAMESPACE__ . '\quote_register_block_type_args', 10, 2 );
