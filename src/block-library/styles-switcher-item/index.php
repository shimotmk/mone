<?php
/**
 * Registers the `mone/styles-switcher-item` block.
 *
 * @package mone
 */

namespace Mone_Theme\Styles_Switcher_Item;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register block
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 */
function render_block_styles_switcher_item( $block_content, $block ) {
	$style_variations = $block['attrs']['styleVariations'] ?? '';

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag( 'button' ) ) {
		$p->set_attribute( 'data-wp-on--click', 'mone/styles-switcher::actions.navigate' );
		// URLクエリーでやらない場合 Full-page client-side navigationが必要.
		// $p->set_attribute( 'data-wp-on--click', 'actions.clickDarkStyle' ); // .
		$p->set_attribute( 'data-wp-on--focusout', 'actions.handleMenuFocusout' );
		$p->set_attribute( 'data-wp-watch', 'callbacks.initMenu' );
		$p->set_attribute( 'value', $style_variations );
	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_mone/styles-switcher-item', __NAMESPACE__ . '\render_block_styles_switcher_item', 10, 2 );


/**
 * Register block
 *
 * @return void
 */
function register_block_styles_switcher_item() {
	register_block_type(
		__DIR__
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_styles_switcher_item' );
