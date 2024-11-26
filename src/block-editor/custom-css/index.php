<?php
/**
 * Custom Css
 *
 * @package mone
 */

namespace Mone_Theme\Custom_Css;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * カスタムCSSをサポートしているかどうか
 *
 * @param string $block_name block_name.
 * @return string
 */
function has_custom_css_support( $block_name ) {
	if ( empty( $block_name ) ) {
		return false;
	}

	$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $block_name );
	if ( ! block_has_support( $block_type, array( 'customClassName' ), true ) ) {
		return false;
	}

	return true;
}

/**
 * 各ブロックにmoneCustomCssのattributesを追加する
 *
 * @param string $settings settings.
 * @param array  $metadata metadata.
 * @return string
 */
function add_custom_css_attributes( $settings, $metadata ) {
	if ( ! has_custom_css_support( $metadata['name'] ) ) {
		return $settings;
	}

	$attributes = array();
	if ( ! empty( $settings['attributes'] ) ) {
		$attributes = $settings['attributes'];
	}
	$add_attributes = array(
		'moneCustomCss' => array(
			'type' => 'string',
		),
	);

	$settings['attributes'] = array_merge(
		$attributes,
		$add_attributes
	);
	return $settings;
}
add_filter( 'block_type_metadata_settings', __NAMESPACE__ . '\add_custom_css_attributes', 10, 2 );

/**
 * Render Custom Css
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string
 */
function render_custom_css( $block_content, $block ) {
	if ( ! has_custom_css_support( $block['blockName'] ) ) {
		return $block_content;
	}

	if ( empty( $block['attrs']['moneCustomCss'] ) ) {
		return $block_content;
	}

	$css = $block['attrs']['moneCustomCss'];
	if ( strpos( $css, 'selector' ) !== false ) {
		$unique_class = wp_unique_id( 'mone_custom_css_' );
		$css          = preg_replace( '/selector/', '.' . $unique_class, $css );
		$p            = new \WP_HTML_Tag_Processor( $block_content );
		if ( $p->next_tag() ) {
			$p->add_class( $unique_class );
		}
		$block_content = $p->get_updated_html();
	}

	wp_enqueue_block_support_styles( escape_inline_style( $css ) );

	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_custom_css', 10, 2 );

/**
 * Escape inline style
 *
 * @param string $css css.
 * @return string
 */
function escape_inline_style( $css ) {

	if ( false !== stripos( $css, '</style>' ) ) {
		_doing_it_wrong(
			__FUNCTION__,
			sprintf(
				/* translators: 1: <style>, 2: escape_inline_style() */
				__( 'Do not pass %1$s tags to %2$s.' ),
				'<code>&lt;style&gt;</code>',
				'<code>escape_inline_style()</code>'
			),
			'1.0.0'
		);
		$css = trim( preg_replace( '#<style[^>]*>(.*)</style>#is', '$1', $css ) );
	}

	// <style>タグと<script>タグを削除
	$css = preg_replace( '/<style\b[^>]*>(.*?)<\/style>/is', '', $css );
	$css = preg_replace( '/<script\b[^>]*>(.*?)<\/script>/is', '', $css );

	return $css;
}
