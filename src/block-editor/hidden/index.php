<?php
/**
 * Hidden Extension
 *
 * @package mone
 */

namespace Mone_Theme\Hidden_Extension;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * カスタムCSSをサポートしているかどうか
 *
 * @param string $block_name block_name.
 * @return string
 */
function has_hidden_extension_support( $block_name ) {
	if ( empty( $block_name ) ) {
		return false;
	}

	$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $block_name );
	if ( ! block_has_support( $block_type, array( 'customClassName' ), true ) ) {
		return false;
	}

	return true;
}

/**
 * Render Hidden Extension
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string
 */
function render_hide_extension( $block_content, $block ) {
	if ( ! has_hidden_extension_support( $block['blockName'] ) ) {
		return $block_content;
	}

	if ( empty( $block['attrs']['className'] ) ) {
		return $block_content;
	}

	$class_name  = $block['attrs']['className'] ?? '';
	$class_array = explode( ' ', $class_name );

	$current_post_type = get_post_type();
	foreach ( $class_array as $class ) {
		if ( preg_match( '/^mone-post-type-(.*)-none$/', $class, $matches ) ) {
			$post_type = $matches[1];
			if ( $post_type === $current_post_type ) {
				return '';
			}
		}
	}

	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_hide_extension', 10, 2 );
