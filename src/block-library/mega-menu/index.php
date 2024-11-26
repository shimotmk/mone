<?php
/**
 * Registers the `mone/mega-menu` block.
 *
 * @package mone
 */

namespace Mone_Theme\Mega_Menu;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register block
 *
 * @return void
 */
function register_block_mega_menu() {
	register_block_type(
		__DIR__
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_mega_menu' );

/**
 * Register menu template part area
 *
 * @param array $areas Areas.
 * @return array
 */
function mega_menu_template_part_areas( array $areas ) {
	$areas[] = array(
		'area'        => 'menu',
		'area_tag'    => 'div',
		'description' => __( 'Once you create a template part, you can select it in the mega menu..', 'mone' ),
		'icon'        => 'navigation',
		'label'       => __( 'Menu', 'mone' ),
	);

	return $areas;
}
add_filter( 'default_wp_template_part_areas', __NAMESPACE__ . '\mega_menu_template_part_areas' );
