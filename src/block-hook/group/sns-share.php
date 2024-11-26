<?php
/**
 * Group SNS_Share
 *
 * @package mone
 */

namespace Mone_Theme\Group\SNS_Share;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render Group
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 */
function render_block_show_share_button( $block_content, $parsed_block ) {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $block_content;
	}

	$pattern_names = array( 'mone/sns-share', 'mone/sns-share-simple' );
	if ( ! isset( $parsed_block['attrs']['metadata']['patternName'] ) || ! in_array( $parsed_block['attrs']['metadata']['patternName'], $pattern_names, true ) ) {
		return $block_content;
	}

	global $post;
	$show_share_button_on_page = get_post_meta( $post->ID, 'mone_is_show_share_button_on_page', true );
	if ( 'hide' === $show_share_button_on_page ) {
		return '';
	}

	return $block_content;
}
add_filter( 'render_block_core/group', __NAMESPACE__ . '\render_block_show_share_button', 10, 2 );
