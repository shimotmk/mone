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
 * @param array  $block block.
 * @param object $instance instance.
 */
function render_block_dialog_link( $block_content ) {

	$p = new \WP_HTML_Tag_Processor( $block_content );
	while ( $p->next_tag( 'a' ) ) {
		$p->set_bookmark( 'aTag' );
		$class = $p->get_attribute( 'class' );
		$href = $p->get_attribute( 'href' );

		if ( $class === 'mone-dialog-link' ) {
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
 * @param object $instance instance.
 */
function render_block_dialog_group( $block_content, $block ) {
	$class_name = $block['attrs']['className'] ?? '';
	if ( ! $class_name || ! str_contains( $class_name, 'mone-dialog-content' ) ) {
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
