<?php
/**
 * Set up theme
 *
 * @package mone
 */

namespace Mone_Theme\Set_Up_Theme;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Mone navigation render fallback
 *
 * @param array $fallback_blocks Fallback blocks.
 * @return array
 */
function navigation_render_fallback( $fallback_blocks ) {
	$page_list_fallback = array(
		array(
			'blockName'    => 'core/page-list',
			'innerContent' => array(),
			'attrs'        => array(),
		),
	);

	$all_clear_page_list_fallback = array(
		array(
			'blockName'    => 'core/page-list',
			'attrs'        => array(),
			'innerBlocks'  => array(),
			'innerHTML'    => '',
			'innerContent' => array(),
		),
	);

	if ( $fallback_blocks !== $page_list_fallback
		&& $fallback_blocks !== $all_clear_page_list_fallback
	) {
		return $fallback_blocks;
	}

	$mone_fallback_blocks = array(
		array(
			'blockName'    => 'core/home-link',
			'innerContent' => array(),
			'attrs'        => array(
				'label' => __( 'Home', 'mone' ),
			),
		),
		array(
			'blockName'    => 'core/navigation-link',
			'innerContent' => array(),
			'attrs'        => array(
				'label' => __( 'Category', 'mone' ),
				'type'  => 'category',
				'id'    => 1,
				'url'   => get_category_link( 1 ),
				'kind'  => 'taxonomy',
			),
		),
		array(
			'blockName'    => 'core/page-list',
			'innerContent' => array(),
			'attrs'        => array(),
		),
		array(
			'blockName'    => 'core/navigation-submenu',
			'innerContent' => array(),
			'attrs'        => array(
				'label' => __( 'Custom Link', 'mone' ),
				'url'   => '#',
				'kind'  => 'custom',
			),
			'innerBlocks'  => array(
				array(
					'blockName' => 'core/navigation-link',
					'attrs'     => array(
						'label' => __( 'Custom Link', 'mone' ),
						'url'   => '#',
						'kind'  => 'custom',
					),
				),
				array(
					'blockName' => 'core/navigation-link',
					'attrs'     => array(
						'label' => __( 'Custom Link', 'mone' ),
						'url'   => '#',
						'kind'  => 'custom',
					),
				),
			),
		),
	);
	if ( $fallback_blocks === $all_clear_page_list_fallback
	) {
		return $mone_fallback_blocks;
	}

	return $fallback_blocks;
}
add_filter( 'block_core_navigation_render_fallback', __NAMESPACE__ . '\navigation_render_fallback' );

/**
 * Load plugin textdomain.
 */
function load_textdomain() {
	load_theme_textdomain( 'mone', MONE_TEMPLATE_DIR_PATH . '/languages' );
}
add_action( 'after_setup_theme', __NAMESPACE__ . '\load_textdomain' );
