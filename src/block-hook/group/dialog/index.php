<?php
/**
 * Dialog
 *
 * @package mone
 */

namespace Mone_Theme\Group\Dialog;
use function Mone_Theme\UtilsFunc\exists_class_name;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once MONE_TEMPLATE_DIR_PATH . '/build/block-hook/group/dialog/disable-lightbox.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/block-hook/group/dialog/image.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/block-hook/group/dialog/dialog-content.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/block-hook/group/dialog/group.php';

/**
 * Render dialog link.
 *
 * @param string $block_content block_content.
 *
 * @return string
 */
function render_block_dialog_inline_trigger( $block_content ) {

	$p = new \WP_HTML_Tag_Processor( $block_content );
	while ( $p->next_tag( 'button' ) ) {
		$p->set_bookmark( 'buttonTag' );
		$class = $p->get_attribute( 'class' );
		$id    = $p->get_attribute( 'data-dialog-id' );

		if ( exists_class_name( 'mone-dialog-inline', $class ) && exists_class_name( 'mone-dialog-trigger', $class ) && null !== $id && 0 === strpos( $id, '#dialog-' ) ) {
			$p->seek( 'buttonTag' );
			$p->set_attribute( 'data-wp-interactive', 'mone/dialog-trigger' );
			$p->set_attribute( 'data-wp-on--click', 'actions.clickDialogTrigger' );
			$p->set_attribute( 'aria-haspopup', 'dialog' );
			$p->set_attribute( 'aria-label', __( 'Open dialog', 'mone' ) );

			$p->set_attribute(
				'data-wp-context',
				wp_json_encode(
					array(
						'dialogId' => $id,
					),
					JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
				)
			);

		}
	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_block_dialog_inline_trigger', 10, 2 );

/**
 * Render dialog image.
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string
 */
function render_block_dialog_mone_icon( $block_content, $block ) {
	$class_name = isset( $block['attrs']['className'] ) ? $block['attrs']['className'] : '';
	if ( ! exists_class_name( 'mone-dialog-trigger', $class_name ) ) {
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
		$p->set_attribute( 'aria-haspopup', 'dialog' );
		$p->set_attribute( 'aria-label', __( 'Open dialog', 'mone' ) );

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
add_filter( 'render_block_mone/icon', __NAMESPACE__ . '\render_block_dialog_mone_icon', 10, 2 );

/**
 * Render button.
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string
 */
function render_block_dialog_button( $block_content, $block ) {
	$class_name = isset( $block['attrs']['className'] ) ? $block['attrs']['className'] : '';
	if ( ! exists_class_name( 'mone-dialog-trigger', $class_name ) ) {
		return $block_content;
	}

	$dialog_id = isset( $block['attrs']['moneDialogId'] ) ? $block['attrs']['moneDialogId'] : '';
	if ( ! $dialog_id ) {
		return $block_content;
	}

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag( 'button' ) ) {
		$p->set_attribute( 'data-wp-interactive', 'mone/dialog-trigger' );
		$p->set_attribute( 'data-wp-on--click', 'actions.clickDialogTrigger' );
		$p->set_attribute( 'aria-haspopup', 'dialog' );
		$p->set_attribute( 'aria-label', __( 'Open dialog', 'mone' ) );

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
add_filter( 'render_block_core/button', __NAMESPACE__ . '\render_block_dialog_button', 10, 2 );
