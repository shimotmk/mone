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
 * @return array
 */
function disable_lightbox_in_dialog_group( $parsed_block ) {
	if ( 'core/image' === $parsed_block['blockName'] && isset( $parsed_block['attrs']['isParentDialog'] ) && $parsed_block['attrs']['isParentDialog'] ) {
		$parsed_block['attrs']['lightbox'] = array( 'enabled' => false );
	}

	return $parsed_block;
}
add_filter( 'render_block_data', __NAMESPACE__ . '\disable_lightbox_in_dialog_group' );

/**
 * ダイアログの子ブロックに画像がある時にフラグを付ける
 *
 * @param array $blocks blocks.
 * @return array
 */
function update_image_blocks( $blocks ) {
	foreach ( $blocks as &$block ) {
		if ( 'core/image' === $block['blockName'] ) {
			$block['attrs']['isParentDialog'] = true;
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			$block['innerBlocks'] = update_image_blocks( $block['innerBlocks'] );
		}
	}

	return $blocks;
}

/**
 * ダイアログ内にある画像ブロックはattrsを使ってフラグ追加
 *
 * @param array $parsed_block parsed_block.
 * @return array
 */
function update_image_in_dialog( $parsed_block ) {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $parsed_block;
	}

	if ( 'core/group' !== $parsed_block['blockName'] || empty( $parsed_block['attrs']['className'] ) || str_contains( $parsed_block['attrs']['className'], 'dialog_input_area' ) ) {
		return $parsed_block;
	}

	$parsed_block['innerBlocks'] = update_image_blocks( $parsed_block['innerBlocks'] );

	return $parsed_block;
}
add_filter( 'render_block_data', __NAMESPACE__ . '\update_image_in_dialog' );
