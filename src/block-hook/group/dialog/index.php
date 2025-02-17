<?php
/**
 * Dialog
 *
 * @package mone
 */

namespace Mone_Theme\Group\Dialog;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render dialog link.
 *
 * @param string $block_content block_content.
 *
 * @return string
 */
function render_block_dialog_link( $block_content ) {

	$p = new \WP_HTML_Tag_Processor( $block_content );
	while ( $p->next_tag( 'a' ) ) {
		$p->set_bookmark( 'aTag' );
		$class = $p->get_attribute( 'class' );
		$href  = $p->get_attribute( 'href' );

		if ( 'mone-dialog-link' === $class && strpos( $href, '#dialog-' ) === 0 ) {
			$p->seek( 'aTag' );
			$p->set_attribute( 'data-wp-interactive', 'mone/dialog-link' );
			$p->set_attribute( 'data-wp-on--click', 'actions.clickDialogButton' );

			$p->set_attribute(
				'data-wp-context',
				wp_json_encode(
					array(
						'dialogHref' => $href,
					),
					JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
				)
			);

		}
	}

	
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_block_dialog_link', 10, 2 );

/**
 * Render dialog.
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string
 */
function render_block_dialog_group( $block_content, $block ) {
	$class_name = isset( $block['attrs']['className'] ) ? $block['attrs']['className'] : '';
	if ( ! str_contains( $class_name, 'mone-dialog-content' ) ) {
		return $block_content;
	}

	$tag_name = isset( $block['attrs']['tagName'] ) ? $block['attrs']['tagName'] : '';
	if ( 'dialog' !== $tag_name ) {
		return $block_content;
	}

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag() ) {
		$id = $p->get_attribute( 'id' );
		$p->set_attribute( 'data-wp-interactive', 'mone/dialog-content' );
		$p->set_attribute( 'data-wp-on--click', 'actions.closeDialogArea' );
		$p->set_attribute( 'data-wp-on--keydown', 'actions.handleKeydown' );

		$p->set_attribute(
			'data-wp-context',
			wp_json_encode(
				array(
					'dialogHref' => '#' . $id,
				),
				JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
			)
		);

	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/group', __NAMESPACE__ . '\render_block_dialog_group', 10, 2 );

/**
 * ダイアログブロックの中の画像ブロックのlightboxを無効にする
 *
 * @param array $parsed_block parsed_block.
 * @return array
 */
function remove_lightbox( $parsed_block ) {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $parsed_block;
	}

	if ( 'core/group' !== $parsed_block['blockName'] ) {
		return $parsed_block;
	}

	$class_name = isset( $parsed_block['attrs']['className'] ) ? $parsed_block['attrs']['className'] : '';
	if ( ! str_contains( $class_name, 'mone-dialog-content' ) ) {
		return $parsed_block;
	}

	$tag_name = isset( $parsed_block['attrs']['tagName'] ) ? $parsed_block['attrs']['tagName'] : '';
	if ( 'dialog' !== $tag_name ) {
		return $parsed_block;
	}

	$parsed_block['innerBlocks'] = update_core_image_dialog_blocks( $parsed_block['innerBlocks'] );

	return $parsed_block;
}
add_filter( 'render_block_data', __NAMESPACE__ . '\remove_lightbox' );

/**
 * ダイアログブロックの中の画像ブロックのlightboxを無効にする
 *
 * @param array $blocks blocks.
 * @return array
 */
function update_core_image_dialog_blocks( $blocks ) {
	foreach ( $blocks as &$block ) {
		if ( 'core/image' === $block['blockName'] ) {
			$block['attrs']['lightbox'] = false;
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			$block['innerBlocks'] = update_core_image_dialog_blocks( $block['innerBlocks'] );
		}
	}

	return $blocks;
}
