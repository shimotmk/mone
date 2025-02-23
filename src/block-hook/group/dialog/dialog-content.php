<?php
/**
 * Dialog content
 *
 * @package mone
 */

namespace Mone_Theme\Group\Dialog\Content;
use function Mone_Theme\UtilsFunc\mone_process_spacing;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

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

	$arial_label  = isset( $block['attrs']['ariaLabel'] ) ? $block['attrs']['ariaLabel'] : '';
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
		$p->set_attribute( 'role', 'dialog' );
		$p->set_attribute( 'aria-modal', 'true' );
		if ( ! $arial_label ) {
			$p->set_attribute( 'aria-label', __( 'Dialog content', 'mone' ) );
		}

		$p->set_attribute(
			'data-wp-context',
			wp_json_encode(
				array(
					'dialogId' => '#' . $id,
				),
				JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
			)
		);

		if ( $p->next_tag(
			array(
				'tag_name'   => 'div',
				'class_name' => 'dialog-close-button',
			)
		) ) {
			if ( $p->next_tag(
				array(
					'tag_name' => 'button',
				)
			) ) {
				$p->set_attribute( 'data-wp-interactive', 'mone/dialog-content' );
				$p->set_attribute( 'data-wp-on--click', 'actions.closeDialogById' );
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
		}
	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/group', __NAMESPACE__ . '\render_block_dialog_group', 10, 2 );


/**
 * Render dialog.
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string
 */
function render_block_dialog_sticky( $block_content, $block ) {
	$is_parent_dialog = isset( $block['attrs']['moneIsParentDialog'] ) ? $block['attrs']['moneIsParentDialog'] : '';
	if ( ! $is_parent_dialog ) {
		return $block_content;
	}

	$position_type = isset( $block['attrs']['style']['position']['type'] ) ? $block['attrs']['style']['position']['type'] : '';
	$position_top  = isset( $block['attrs']['style']['position']['top'] ) ? $block['attrs']['style']['position']['top'] : '';

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag() ) {

		$existing_style = $p->get_attribute( 'style' );
		$updated_style  = '';
		if ( ! empty( $existing_style ) ) {
			$updated_style = $existing_style;
			if ( ! str_ends_with( $existing_style, ';' ) ) {
				$updated_style .= ';';
			}
		}

		if ( 'sticky' === $position_type ) {
			$updated_style .= 'top: ' . $position_top . ';';
		}

		$p->set_attribute( 'style', $updated_style );
	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/group', __NAMESPACE__ . '\render_block_dialog_sticky', 10, 2 );
