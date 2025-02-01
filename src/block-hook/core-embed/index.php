<?php
/**
 * Core Embed
 *
 * @package mone
 */

namespace Mone_Theme\Embed;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block_categories_all
 *
 * @param array $categories categories.
 * @return array
 */
function block_categories( $categories ) {
	$categories = array_filter(
		$categories,
		function ( $category ) {
			return 'embed' !== $category['slug'];
		}
	);

	$add_categories = array(
		array(
			'slug'  => 'embed',
			'title' => __( 'Embed' ),
			'icon'  => '',
		),
	);
	array_splice( $categories, 4, 0, $add_categories );

	return $categories;
}
add_filter( 'block_categories_all', __NAMESPACE__ . '\block_categories', 10, 2 );

/**
 * Embed block
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 * @return string $block_content block_content.
 */
function render_block_embed( $block_content, $parsed_block ) {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $block_content;
	}

	if ( ! isset( $parsed_block['attrs']['providerNameSlug'] ) || 'youtube' !== $parsed_block['attrs']['providerNameSlug'] ) {
		return $block_content;
	}

	if ( strpos( $block_content, 'youtube.com' ) !== false || strpos( $block_content, 'youtu.be' ) !== false ) {
		$p = new \WP_HTML_Tag_Processor( $block_content );
		if ( $p->next_tag( 'iframe' ) ) {
			$src = $p->get_attribute( 'src' );
			$p->set_attribute( 'data-src', $src );
			$p->add_class( 'mone-lazy-load' );
			$p->remove_attribute( 'src' );

			$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/block-hook/core-embed/index.asset.php';
			wp_enqueue_script(
				'mone-prism-script',
				MONE_TEMPLATE_DIR_URL . '/build/block-hook/core-embed/view-script.js',
				$asset_file['dependencies'],
				$asset_file['version'],
				true
			);
		}
		$block_content = $p->get_updated_html();
	}
	return $block_content;
}
add_filter( 'render_block_core/embed', __NAMESPACE__ . '\render_block_embed', 10, 2 );
