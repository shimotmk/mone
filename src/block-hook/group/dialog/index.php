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

/**
 * Render dialog link.
 *
 * @param string $block_content block_content.
 *
 * @return string
 */
function render_block_dialog_link( $block_content ) {

	$p = new \WP_HTML_Tag_Processor( $block_content );
	while ( $p->next_tag( 'button' ) ) {
		$p->set_bookmark( 'buttonTag' );
		$class = $p->get_attribute( 'class' );
		$id    = $p->get_attribute( 'data-dialog' );

		if ( 'mone-dialog-link' === $class && null !== $id && 0 === strpos( $id, '#dialog-' ) ) {
			$p->seek( 'buttonTag' );
			$p->set_attribute( 'data-wp-interactive', 'mone/dialog-link' );
			$p->set_attribute( 'data-wp-on--click', 'actions.clickDialogLink' );

			$p->set_attribute(
				'data-wp-context',
				wp_json_encode(
					array(
						'dialogHref' => $id,
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
 * Render dialog image.
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string
 */
function render_block_dialog_image( $block_content, $block ) {
	if ( ! ( 'core/image' === $block['blockName'] || 'mone/icon' === $block['blockName'] ) ) {
		return $block_content;
	}

	$class_name = isset( $block['attrs']['className'] ) ? $block['attrs']['className'] : '';
	if ( ! str_contains( $class_name, 'mone-dialog-link' ) ) {
		return $block_content;
	}

	$dialog_link = isset( $block['attrs']['moneDialogLink'] ) ? $block['attrs']['moneDialogLink'] : '';
	if ( ! $dialog_link ) {
		return $block_content;
	}

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag( array( 'class_name' => 'mone-dialog-link' ) ) ) {
		$p->set_attribute( 'data-wp-interactive', 'mone/dialog-link' );
		$p->set_attribute( 'data-wp-on--click', 'actions.clickDialogLink' );

		$p->set_attribute(
			'data-wp-context',
			wp_json_encode(
				array(
					'dialogHref' => $dialog_link,
				),
				JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
			)
		);

	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_block_dialog_image', 10, 2 );

/**
 * Render dialog inner link.
 *
 * @param string $block_content block_content.
 *
 * @return string
 */
function render_block_dialog_inner_link( $block_content ) {
	$p = new \WP_HTML_Tag_Processor( $block_content );
	while ( $p->next_tag( array( 'class_name' => 'mone-dialog-link' ) ) ) {
		while ( $p->next_tag( 'a' ) ) {
			$p->set_bookmark( 'aTag' );
			$href = $p->get_attribute( 'href' );

			if ( null !== $href && 0 === strpos( $href, '#dialog-' ) ) {
				$p->seek( 'aTag' );
				$p->set_attribute( 'data-wp-interactive', 'mone/dialog-link' );
				$p->set_attribute( 'data-wp-on--click', 'actions.clickDialogLink' );

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
	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_block_dialog_inner_link', 10, 2 );

/**
 * Render button.
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string
 */
function render_block_dialog_button( $block_content, $block ) {
	$class_name = isset( $block['attrs']['className'] ) ? $block['attrs']['className'] : '';
	if ( ! str_contains( $class_name, 'mone-dialog-link' ) ) {
		return $block_content;
	}

	$dialog_link = isset( $block['attrs']['moneDialogLink'] ) ? $block['attrs']['moneDialogLink'] : '';
	if ( ! $dialog_link ) {
		return $block_content;
	}

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag( 'button' ) ) {
		$p->set_attribute( 'data-wp-interactive', 'mone/dialog-link' );
		$p->set_attribute( 'data-wp-on--click', 'actions.clickDialogLink' );

		$p->set_attribute(
			'data-wp-context',
			wp_json_encode(
				array(
					'dialogHref' => $dialog_link,
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
 * @param array $source_block source_block.
 * @param array $parent_block parent_block.
 * @return array
 */
function block_image_lightbox( $parsed_block, $source_block, $parent_block ) {
	if ( 'core/image' === $parsed_block['blockName'] && $parent_block && 'core/group' === $parent_block->parsed_block['blockName'] ) {
		if ( ! isset( $parsed_block['attrs'] ) ) {
			$parsed_block['attrs'] = array();
		}
		$parsed_block['attrs'] = array_merge(
			$parsed_block['attrs'],
			array(
				'lightbox' => array(
					'enabled' => false,
				),
			)
		);
	}

	return $parsed_block;
}
// add_filter( 'render_block_data', __NAMESPACE__ . '\block_image_lightbox', 10, 3 );

/**
 * ダイアログブロックの中の画像ブロックのlightboxを無効にする
 *
 * @param array $parsed_block parsed_block.
 * @return array
 */
function update_core_image_dialog_blocks( $parsed_block ) {
	foreach ( $parsed_block as $key => $inner_block ) {
		if ( 'core/image' === $inner_block['blockName'] ) {
			if ( ! isset( $parsed_block[ $key ]['attrs'] ) ) {
				$parsed_block[ $key ]['attrs'] = array();
			}
			$parsed_block[ $key ]['attrs'] = array_merge(
				$parsed_block[ $key ]['attrs'],
				array(
					'lightbox' => array(
						'enabled' => false,
					),
				)
			);
		} elseif ( ! empty( $inner_block['innerBlocks'] ) ) {
			$parsed_block[ $key ]['innerBlocks'] = update_core_image_dialog_blocks( $inner_block['innerBlocks'] );
		}
	}

	return $parsed_block;
}
