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
 * @param string $content content.
 * @param array  $parsed_block parsed block.
 * @return string
 */
function render_block_code( $content, $parsed_block ) {
	$content   = new \WP_HTML_Tag_Processor( $content );
	$unique_id = wp_unique_id( 'code-' );
	if ( $content->next_tag( 'pre' ) ) {
		if ( isset( $parsed_block['attrs']['moneLanguageName'] ) ) {
				$content->add_class( 'language-' . $parsed_block['attrs']['moneLanguageName'] );
		}
		$content->set_attribute( 'data-wp-interactive', 'mone/code' );
		$content->set_attribute(
			'data-wp-context',
			wp_json_encode(
				array(
					'isWrap' => 'white-space: pre;',
				),
				JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
			)
		);

		if ( isset( $parsed_block['attrs']['moneHeight'] ) ) {
			$existing_style = $content->get_attribute( 'style' );
			$updated_style  = '';
			if ( ! empty( $existing_style ) ) {
				$updated_style = $existing_style;
				if ( ! str_ends_with( $existing_style, ';' ) ) {
					$updated_style .= ';';
				}
			}

			$updated_style .= 'height:' . $parsed_block['attrs']['moneHeight'] . ';';
			$content->set_attribute( 'style', $updated_style );
		}
	}

	if ( $content->next_tag( 'code' ) ) {
		$content->set_attribute( 'data-mb-clip', $unique_id );
		$content->set_attribute( 'data-wp-interactive', 'mone/code' );
		$content->set_attribute( 'data-wp-bind--style', 'context.isWrap' );
		$content->add_class( 'prism-code' );
	}
	$content = $content->get_updated_html();

	$button  = '<div class="mone-code-buttons"><button
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
	$content = preg_replace( '/<code/', $button . '<code', $content, 1 );

	wp_enqueue_script( 'clipboard' );
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/block-hook/code/index.asset.php';
	wp_enqueue_script(
		'mone-prism-script',
		MONE_TEMPLATE_DIR_URL . '/build/block-hook/code/prism.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	return $content;
}
add_filter( 'render_block_core/code', __NAMESPACE__ . '\render_block_code', 10, 3 );
