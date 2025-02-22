<?php
/**
 * Image Dialog
 *
 * @package mone
 */

namespace Mone_Theme\Group\Dialog\Image;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render dialog image.
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string
 */
function render_block_dialog_image( $block_content, $block ) {
	$class_name = isset( $block['attrs']['className'] ) ? $block['attrs']['className'] : '';
	if ( ! str_contains( $class_name, 'mone-dialog-trigger' ) ) {
		return $block_content;
	}

	$dialog_id = isset( $block['attrs']['moneDialogId'] ) ? $block['attrs']['moneDialogId'] : '';
	if ( ! $dialog_id ) {
		return $block_content;
	}

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag( array( 'class_name' => 'mone-dialog-trigger' ) ) ) {
		$p->set_attribute( 'data-wp-interactive', 'mone/dialog-trigger' );
		$p->set_attribute( 'data-wp-on--click', 'actions.clickDialogTrigger' );

		$p->set_attribute(
			'data-wp-context',
			wp_json_encode(
				array(
					'dialogId' => $dialog_id,
				),
				JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
			)
		);

	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/image', __NAMESPACE__ . '\render_block_dialog_image', 10, 2 );
