<?php
/**
 * Block_Editor
 *
 * @package mone
 */

namespace Mone_Theme\Block_Editor;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_block_categories
 *
 * @param array $categories categories.
 */
function block_categories_all( $categories ) {
	foreach ( $categories as $key => $value ) {
		$keys[] = $value['slug'];
	}
	if ( ! in_array( 'mone-block-cat', $keys, true ) ) {
		$categories = array_merge(
			array(
				array(
					'slug'  => 'mone-block-cat',
					'title' => __( 'Mone', 'mone' ),
					'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>',
				),
			),
			$categories
		);
	}
	return $categories;
}
add_filter( 'block_categories_all', __NAMESPACE__ . '\block_categories_all' );
