<?php
/**
 * Group Dialog
 *
 * @package mone
 */

namespace Mone_Theme\Group\Dialog\Group;
use function Mone_Theme\UtilsFunc\exists_class_name;

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
function render_block_dialog_group( $block_content, $block ) {
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
		$p->add_class( 'mone-dialog-trigger-container' );
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

		wp_interactivity_state(
			'mone/dialog-trigger',
			array(
				'metadata' => array(
					$dialog_id => array(
						'test' => false,
					),
				),
			)
		);

		$p->set_attribute( 'data-wp-on--click', 'actions.clickDialogTrigger' );
		$p->set_attribute( 'data-wp-init', 'callbacks.setGroupButtonStyles' );
		$p->set_attribute( 'data-wp-on-async--load', 'callbacks.setGroupButtonStyles' );
		$p->set_attribute( 'data-wp-on-async-window--resize', 'callbacks.setGroupButtonStyles' );
	}
	$block_content = $p->get_updated_html();

	$dialog_aria_label = __( 'Open dialog', 'mone' );
	$group             = null;
	preg_match( '/<div[^>]+>/', $block_content, $group );
	$button =
		$group[0]
		. '<button
			class="mone-dialog-trigger mone-dialog-trigger-button wp-block-group__link"
			type="button"
			aria-haspopup="dialog"
			aria-label="' . esc_attr( $dialog_aria_label ) . '"
			data-wp-interactive="mone/dialog-trigger"
			data-wp-init="callbacks.initGroupTriggerButton"
			data-wp-on-async--click="actions.clickDialogTrigger"
			data-wp-style--right="state.dialogButtonRight"
			data-wp-style--top="state.dialogButtonTop"
			
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="#ffffff" d="M208,90H48a14,14,0,0,0-14,14v96a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V104A14,14,0,0,0,208,90Zm2,110a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V104a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2ZM50,64a6,6,0,0,1,6-6H200a6,6,0,0,1,0,12H56A6,6,0,0,1,50,64ZM66,32a6,6,0,0,1,6-6H184a6,6,0,0,1,0,12H72A6,6,0,0,1,66,32Z"></path></svg>
		</button>';

	$block_content = preg_replace( '/<div[^>]+>/', $button, $block_content, 1 );

	return $block_content;
}
add_filter( 'render_block_core/group', __NAMESPACE__ . '\render_block_dialog_group', 10, 2 );
