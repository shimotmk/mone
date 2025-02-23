<?php
/**
 * Disable_Lightbox in Dialog
 *
 * @package mone
 */

namespace Mone_Theme\Group\Dialog\Disable_Lightbox;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * ダイアログブロックの中の画像ブロックのlightboxを無効にする
 *
 * @param array $parsed_block parsed_block.
 * @param array $block block.
 * @return array
 */
function render_image_in_dialog( $block_content, $block ) {
	$class_name = isset( $block['attrs']['className'] ) ? $block['attrs']['className'] : '';
	if ( ! str_contains( $class_name, 'mone-dialog-content' ) ) {
		return $block_content;
	}

	$tag_name = isset( $block['attrs']['tagName'] ) ? $block['attrs']['tagName'] : '';
	if ( 'dialog' !== $tag_name ) {
		return $block_content;
	}

	$p = new \WP_HTML_Tag_Processor( $block_content );
	while ( $p->next_tag(
		array(
			'tag_name'   => 'figure',
			'class_name' => 'wp-block-image',
		)
	) ) {
		$p->remove_attribute( 'data-wp-interactive' );
		$p->remove_class( 'wp-lightbox-container' );
	}
	$block_content = $p->get_updated_html();

	$pattern       = '/(<img[^>]*>)(<button[^>]*>.*?<\/button>)/is';
	$replacement   = '$1';
	$block_content = preg_replace( $pattern, $replacement, $block_content );

	return $block_content;
}
add_filter( 'render_block_core/group', __NAMESPACE__ . '\render_image_in_dialog', 10, 2 );
