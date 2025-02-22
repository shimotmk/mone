<?php
/**
 * Dialog
 *
 * @package mone
 */

namespace Mone_Theme\Group\Dialog;
use function Mone_Theme\UtilsFunc\mone_process_spacing;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once MONE_TEMPLATE_DIR_PATH . '/build/block-hook/group/dialog/disable-lightbox.php';
require_once MONE_TEMPLATE_DIR_PATH . '/build/block-hook/group/dialog/image.php';

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
		$id    = $p->get_attribute( 'data-dialog' );

		if ( str_contains( $class, 'mone-dialog-inline' ) && str_contains( $class, 'mone-dialog-trigger' ) && null !== $id && 0 === strpos( $id, '#dialog-' ) ) {
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
	if ( ! str_contains( $class_name, 'mone-dialog-trigger' ) ) {
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

	$margin_left  = isset( $block['attrs']['style']['spacing']['margin']['left'] ) ? $block['attrs']['style']['spacing']['margin']['left'] : '';
	$margin_right = isset( $block['attrs']['style']['spacing']['margin']['right'] ) ? $block['attrs']['style']['spacing']['margin']['right'] : '';

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag() ) {
		$id = $p->get_attribute( 'id' );

		$existing_style = $p->get_attribute( 'style' );
		$updated_style  = '';
		if ( ! empty( $existing_style ) ) {
			$updated_style = $existing_style;
			if ( ! str_ends_with( $existing_style, ';' ) ) {
				$updated_style .= ';';
			}
		}

		$left  = mone_process_spacing( $margin_left );
		$right = mone_process_spacing( $margin_right );

		if ( $left && $right ) {
			$updated_style .= 'width: calc( 100% - ' . $left . ' - ' . $right . '); max-width: 100%;';
		} elseif ( $right ) {
			$updated_style .= 'width: calc( 100% - ' . $right . '); max-width: 100%;';
		} elseif ( $left ) {
			$updated_style .= 'width: calc( 100% - ' . $left . '); max-width: 100%;';
		}

		$p->set_attribute( 'style', $updated_style );

		$p->set_attribute( 'data-wp-interactive', 'mone/dialog-content' );
		$p->set_attribute( 'data-wp-on--click', 'actions.closeDialogArea' );
		$p->set_attribute( 'data-wp-on--keydown', 'actions.handleKeydown' );

		$p->set_attribute(
			'data-wp-context',
			wp_json_encode(
				array(
					'dialogId' => '#' . $id,
				),
				JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
			)
		);

	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/group', __NAMESPACE__ . '\render_block_dialog_group', 10, 2 );
