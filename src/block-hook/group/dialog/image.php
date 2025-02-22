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
		$p->add_class( 'mone-dialog-container' );
		$p->set_attribute( 'data-wp-interactive', 'mone/dialog-trigger' );
		$p->set_attribute(
			'data-wp-context',
			wp_json_encode(
				array(
					'dialogId' => $dialog_id,
				),
				JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
			)
		);

		if ( $p->next_tag( 'img' ) ) {
			$p->set_attribute( 'data-wp-on--click', 'actions.clickDialogTrigger' );
		}

	}
	$block_content = $p->get_updated_html();

	$aria_label        = __( 'Enlarge' );
	$img = null;
	preg_match( '/<img[^>]+>/', $block_content, $img );
	$button =
		$img[0]
		. '<button
			class="mone-dialog-trigger"
			type="button"
			aria-haspopup="dialog"
			aria-label="' . esc_attr( $aria_label ) . '"
			data-wp-interactive="mone/dialog-trigger"
			data-wp-on--click="actions.clickDialogTrigger"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
				<path fill="#fff" d="M2 0a2 2 0 0 0-2 2v2h1.5V2a.5.5 0 0 1 .5-.5h2V0H2Zm2 10.5H2a.5.5 0 0 1-.5-.5V8H0v2a2 2 0 0 0 2 2h2v-1.5ZM8 12v-1.5h2a.5.5 0 0 0 .5-.5V8H12v2a2 2 0 0 1-2 2H8Zm2-12a2 2 0 0 1 2 2v2h-1.5V2a.5.5 0 0 0-.5-.5H8V0h2Z" />
			</svg>
		</button>';

	$block_content = preg_replace( '/<img[^>]+>/', $button, $block_content );

	return $block_content;
}
add_filter( 'render_block_core/image', __NAMESPACE__ . '\render_block_dialog_image', 10, 2 );
