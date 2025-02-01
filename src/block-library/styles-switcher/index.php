<?php
/**
 * Registers the `mone/styles-switcher` block.
 *
 * @package mone
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Variation switch
 *
 * @param array $block_content block_content.
 * @param array $block block.
 * @return string
 */
function mone_render_block_styles_switcher( $block_content, $block ) {
	$variation_title        = mone_get_style_variation_from_url() ?? '';
	$open_dropdown_on_click = $block['attrs']['openDropdownOnClick'] ?? false;
	$is_toggle              = $block['attrs']['isToggle'] ?? false;
	$has_two_child_blocks   = isset( $block['innerBlocks'] ) && count( $block['innerBlocks'] ) === 2;

	$p = new \WP_HTML_Tag_Processor( $block_content );

	if ( ! $is_toggle || ! $has_two_child_blocks ) {
		if ( $p->next_tag( 'div' ) ) {
			$p->add_class( 'mone-dropdown-switcher' );
			$p->set_attribute( 'data-wp-interactive', 'mone/styles-switcher' );
			$p->set_attribute( 'id', 'dropdown' );
			$p->set_attribute( 'data-wp-class--active', 'context.isActive' );
			$p->set_attribute( 'data-wp-context', '{ "isActive": false, "submenuOpenedBy": { "click": false, "hover": false, "focus": false } }' );
			$p->set_attribute( 'data-wp-watch', 'callbacks.initMenu' );
			$p->set_attribute( 'data-wp-on--focusout', 'actions.handleMenuFocusout' );
			$p->set_attribute( 'tabindex', '-1' );

			if ( ! $open_dropdown_on_click ) {
				$p->set_attribute( 'data-wp-on-async--mouseenter', 'actions.openMenuOnHover' );
				$p->set_attribute( 'data-wp-on-async--mouseleave', 'actions.closeMenuOnHover' );
			} else {
				$p->set_attribute( 'data-wp-on--click', 'actions.toggleMenuOnClick' );
			}
		}

		if ( $p->next_tag( 'ul' ) ) {
			$p->add_class( 'dropdown' );
		}

		$block_content = $p->get_updated_html();

		$pattern        = '/<button[^>]*data-wp-on--click="mone\/styles-switcher::actions.navigate"[^>]*value="' . preg_quote( $variation_title, '/' ) . '"[^>]*>(.*?)<\/button>/i';
		$button_content = preg_match( $pattern, $block_content, $matches ) ? $matches[0] : '';

		$button_content = preg_replace( '/\s*data-wp-on--click="[^"]*"/i', '', $button_content );

		$svg = '<svg data-wp-class--active="context.isActive" data-wp-class--rotated="context.isActive" class="mone-styles-switcher-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="transition-all ml-auto rotate-180">
	<path d="M7 14.5l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
	</svg>';

		$block_content = preg_replace( '/<div class="mone-styles-switcher-title">/', '<div class="mone-styles-switcher-title">' . $button_content . $svg, $block_content, 1 );
	}

	if ( $is_toggle && $has_two_child_blocks ) {
		if ( $p->next_tag( 'div' ) ) {
			$p->set_attribute( 'data-wp-interactive', 'mone/styles-switcher' );
			$p->add_class( 'mone-toggle-switcher' );
			$mone_stylesheet = json_encode( mone_get_variation_stylesheet(), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP );
			$p->set_attribute( 'data-wp-context', '{ "darkStyleSheet": ' . $mone_stylesheet . ' }' );
		}

		$block_content = $p->get_updated_html();

		// ボタンタグのvalue属性を抽出する正規表現パターンを定義.
		$button_value_pattern = '/<button[^>]*value="([^"]*)"[^>]*>/i';
		// ブロックコンテンツからすべてのボタンタグのvalue属性を抽出.
		preg_match_all( $button_value_pattern, $block_content, $matches );
		// 抽出したvalue属性の値を配列に格納.
		$values = $matches[1];
		// variation_titleと一致する場合は次のvalueを、そうでない場合は最初のvalueをターゲット値として設定.
		$target_value = $variation_title === $values[0] ? $values[1] : $values[0] ?? '';
		// ターゲット値を持つ特定のボタンタグを検索する正規表現パターンを定義.
		$button_content_pattern = '/<div[^>]*class="[^"]*wp-block-buttons[^"]*"[^>]*>\s*<div[^>]*class="[^"]*wp-block-button[^"]*"[^>]*>\s*<button[^>]*data-wp-on--click="mone\/styles-switcher::actions.navigate"[^>]*value="' . preg_quote( $target_value, '/' ) . '"[^>]*>(.*?)<\/button>\s*<\/div>\s*<\/div>/is';

		// URLクエリーでやらない場合 Full-page client-side navigationが必要.
		// $button_content_pattern = '/<div[^>]*class="[^"]*wp-block-buttons[^"]*"[^>]*>\s*<div[^>]*class="[^"]*wp-block-button[^"]*"[^>]*>\s*<button[^>]*value="' . preg_quote( $target_value, '/' ) . '"[^>]*>(.*?)<\/button>\s*<\/div>\s*<\/div>/is'; //.

		// ブロックコンテンツからターゲット値を持つボタンタグを抽出.
		$button_content = preg_match( $button_content_pattern, $block_content, $matches ) ? $matches[0] : '';

		$button_content = preg_replace( '/\s*data-wp-on--focusout="[^"]*"/i', '', $button_content );
		$button_content = preg_replace( '/\s*data-wp-watch="[^"]*"/i', '', $button_content );

		$block_content = preg_replace( '/<div class="mone-styles-switcher-title">/', '<div class="mone-styles-switcher-title toggle-switch-button">' . $button_content, $block_content, 1 );

		$block_content = preg_replace( '/<ul[^>]*>.*?<\/ul>/is', '', $block_content );
	}

	$mone_stylesheet = mone_get_variation_stylesheet();

	wp_interactivity_state(
		'mone/styles-switcher',
		array(
			'darkStyles' => '',
		)
	);

	add_action(
		'wp_head',
		function () {
			echo '<style data-wp-interactive="mone/styles-switcher" data-wp-text="state.darkStyles"></style>';
		}
	);

	return $block_content;
}
add_filter( 'render_block_mone/styles-switcher', 'mone_render_block_styles_switcher', 10, 3 );

/**
 * Get_variation_stylesheet
 *
 * @return string stylesheet.
 */
function mone_get_variation_stylesheet() {
	$dark_data  = get_variation_data( 'dark' );
	$theme_json = new WP_Theme_JSON( $dark_data );

	$result = new WP_Theme_JSON();
	// $result->merge( WP_Theme_JSON_Resolver::get_core_data() );
	// $result->merge( WP_Theme_JSON_Resolver::get_theme_data() );
	// $result->merge( WP_Theme_JSON_Resolver::get_user_data() );
	// $result->merge( WP_Theme_JSON_Resolver::get_block_data() );
	$result->merge( $theme_json );
	$tree = WP_Theme_JSON_Resolver::resolve_theme_file_uris( $result );

	$supports_theme_json = wp_theme_has_theme_json();
	if ( empty( $types ) && ! $supports_theme_json ) {
		$types = array( 'variables', 'presets', 'base-layout-styles' );
	} elseif ( empty( $types ) ) {
		$types = array( 'variables', 'styles', 'presets' );
	}

	$styles_variables = '';
	if ( in_array( 'variables', $types, true ) ) {
		$origins          = array( 'default', 'theme', 'custom' );
		$styles_variables = $tree->get_stylesheet( array( 'variables' ), $origins );
		$types            = array_diff( $types, array( 'variables' ) );
	}
	$styles_rest = '';
	if ( ! empty( $types ) ) {
		$origins = array( 'default', 'theme', 'custom' );
		if ( ! $supports_theme_json && ( current_theme_supports( 'appearance-tools' ) || current_theme_supports( 'border' ) ) && current_theme_supports( 'editor-color-palette' ) ) {
			$origins = array( 'default', 'theme' );
		} elseif ( ! $supports_theme_json ) {
			$origins = array( 'default' );
		}
		$styles_rest = $tree->get_stylesheet( $types, $origins );
	}
	$mone_stylesheet = $styles_variables . $styles_rest;
	return $mone_stylesheet;
}

/**
 * Register block
 *
 * @return void
 */
function mone_register_block_styles_switcher() {
	register_block_type(
		__DIR__
	);
}
add_action( 'init', 'mone_register_block_styles_switcher' );

/**
 * Update the theme's variation if valid query string is present.
 *
 * @param WP_Theme_JSON_Data_Gutenberg $theme_json theme json data.
 * @return WP_Theme_JSON_Data_Gutenberg
 */
function mone_filter_theme_json_user( $theme_json ) {
	$variation_title = mone_get_style_variation_from_url();
	if ( empty( $variation_title ) ) {
		return $theme_json;
	}

	$new_data = get_variation_data( $variation_title );

	return $theme_json->update_with( $new_data );
}
add_filter( 'wp_theme_json_data_user', 'mone_filter_theme_json_user' );

/**
 * Get_variation_data
 *
 * @param string $variation_title variation_title.
 * @return WP_Theme_JSON_Data_Gutenberg
 */
function get_variation_data( $variation_title ) {
	$new_data = false;

	$variations = WP_Theme_JSON_Resolver::get_style_variations();
	if ( empty( $variations ) ) {
		return $new_data;
	}

	$variation_details = current(
		array_filter(
			$variations,
			function ( $variation ) use ( $variation_title ) {
				return strtolower( $variation['title'] ) === strtolower( $variation_title );
			}
		)
	);

	if ( ! $variation_details ) {
		return $new_data;
	}

	$new_data = array(
		'version' => 3,
	);

	if ( ! empty( $variation_details['settings'] ) ) {
		$new_data['settings'] = $variation_details['settings'];
	}

	if ( ! empty( $variation_details['styles'] ) ) {
		$new_data['styles'] = $variation_details['styles'];
	}

	return $new_data;
}

/**
 * Return the name of the pattern from the $_GET request.
 *
 * @return string
 */
function mone_get_style_variation_from_url() {
	if ( ! isset( $_GET['style_variation'] ) ) {
		return '';
	}

	$variations      = WP_Theme_JSON_Resolver::get_style_variations();
	$variation_lists = array_map(
		function ( $variation ) {
			return strtolower( $variation['title'] );
		},
		$variations
	);

	$style_variation = sanitize_text_field( urldecode( wp_unslash( $_GET['style_variation'] ) ) );
	if ( ! in_array( $style_variation, $variation_lists, true ) ) {
		return '';
	}
	return $style_variation;
}

/**
 * Appends a query string
 *
 * @param string $link link.
 * @return string URL
 */
function mone_persist_query_string( $link ) {
	$variation_title = mone_get_style_variation_from_url();

	if ( $variation_title ) {
		return add_query_arg( 'style_variation', $variation_title, $link );
	}
	return $link;
}
add_filter( 'page_link', 'mone_persist_query_string' );
add_filter( 'post_link', 'mone_persist_query_string' );
add_filter( 'term_link', 'mone_persist_query_string' );
add_filter( 'home_url', 'mone_persist_query_string' );
add_filter( '_get_page_link', 'mone_persist_query_string' );

/**
 * ボディクラスを追加する関数
 *
 * @param array $classes 既存のボディクラスの配列.
 * @return array 更新されたボディクラスの配列.
 */
function mone_add_body_class( $classes ) {
	$variation_title = mone_get_style_variation_from_url();
	if ( ! empty( $variation_title ) ) {
		$classes[] = 'mone-style-variation-' . sanitize_html_class( strtolower( $variation_title ) );
	}
	return $classes;
}
add_filter( 'body_class', 'mone_add_body_class' );
