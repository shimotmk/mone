<?php
/**
 * Block patterns
 *
 * @package mone
 */

namespace Mone_Theme\Block_Patterns;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register Block Pattern Category.
 */
function register_block_patterns_categories() {
	register_block_pattern_category(
		'mone-404',
		array( 'label' => esc_html__( '404', 'mone' ) )
	);
	register_block_pattern_category(
		'mone-mega-menu',
		array( 'label' => esc_html__( 'Mega menu', 'mone' ) )
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_patterns_categories' );

// ブロックパターンからのブロックパターンの削除する.
add_filter( 'should_load_remote_block_patterns', '__return_false' );

/**
 * Remove core block patterns.
 */
function remove_core_patterns() {
	$core_block_patterns = array(
		'core/query-large-title-posts',
		'core/query-offset-posts',
	);

	foreach ( $core_block_patterns as $core_block_pattern ) {
		unregister_block_pattern( $core_block_pattern );
	}
}
add_action( 'init', __NAMESPACE__ . '\remove_core_patterns' );
