<?php
/**
 * Code
 *
 * @package mone
 */

namespace Mone_Theme\Code;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render block code
 *
 * @param string $block_content block_content.
 * @param array  $block parsed block.
 * @return string
 */
function render_block_code( $block_content, $block ) {
	$block_content = new \WP_HTML_Tag_Processor( $block_content );
	$unique_id     = wp_unique_id( 'code-' );
	if ( $block_content->next_tag( 'pre' ) ) {
		if ( isset( $block['attrs']['moneLanguageName'] ) ) {
				$block_content->add_class( 'language-' . $block['attrs']['moneLanguageName'] );
		}
		$block_content->set_attribute( 'data-wp-interactive', 'mone/code' );
		$block_content->set_attribute(
			'data-wp-context',
			wp_json_encode(
				array(
					'isWrap' => 'white-space: pre;',
				),
				JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
			)
		);

		if ( isset( $block['attrs']['moneHeight'] ) ) {
			$existing_style = $block_content->get_attribute( 'style' );
			$updated_style  = '';
			if ( ! empty( $existing_style ) ) {
				$updated_style = $existing_style;
				if ( ! str_ends_with( $existing_style, ';' ) ) {
					$updated_style .= ';';
				}
			}

			$updated_style .= 'height:' . $block['attrs']['moneHeight'] . ';';
			$block_content->set_attribute( 'style', $updated_style );
		}
	}

	if ( $block_content->next_tag( 'code' ) ) {
		$block_content->set_attribute( 'data-mb-clip', $unique_id );
		$block_content->set_attribute( 'data-wp-interactive', 'mone/code' );
		$block_content->set_attribute( 'data-wp-bind--style', 'context.isWrap' );
		$block_content->add_class( 'prism-code' );
	}
	$block_content = $block_content->get_updated_html();

	$button        = '<div class="mone-code-buttons"><button
		class="mone-copy-button"
		type="button"
		aria-label="' . __( 'Copy to clipboard', 'mone' ) . '"
		data-clipboard-target="[data-mb-clip=' . esc_attr( $unique_id ) . ']"
		data-clipboard-action="copy"
		data-wp-interactive="mone/code"
		data-wp-on--click="actions.clickCopy"
		style="--copy-message: &quot;' . __( 'Code copied!', 'mone' ) . '&quot; "
	>
    <img src="' . esc_url( MONE_TEMPLATE_DIR_URL . '/assets/images/copy.png' ) . '" alt="' . __( 'Copy to clipboard', 'mone' ) . '" class="mone-code-copy-icon">
    <img src="' . esc_url( MONE_TEMPLATE_DIR_URL . '/assets/images/check.png' ) . '" alt="' . __( 'Copied', 'mone' ) . '" class="mone-code-check-icon">
	</button><button 
		class="mone-wrap-button"
		data-wp-interactive="mone/code"
		data-wp-on--click="actions.clickWrap"
	>
    <img src="' . esc_url( MONE_TEMPLATE_DIR_URL . '/assets/images/corner-up-left.png' ) . '" alt="wrap" class="mone-code-wrap-icon">
	</button></div>';
	$block_content = preg_replace( '/<code/', $button . '<code', $block_content, 1 );

	wp_enqueue_script( 'clipboard' );
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/block-hook/code/index.asset.php';
	wp_enqueue_script(
		'mone-prism-script',
		MONE_TEMPLATE_DIR_URL . '/build/block-hook/code/prism.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	return $block_content;
}
add_filter( 'render_block_core/code', __NAMESPACE__ . '\render_block_code', 10, 3 );
