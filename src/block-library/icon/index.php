<?php
/**
 * Registers the `mone/icon` block.
 *
 * @package mone
 */

namespace Mone_Theme\Icon;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function mone_convert_linear_gradient_to_svg( $gradient ) {
	// 正規表現でlinear-gradientの情報を抽出
	preg_match( '/linear-gradient\((\d+)deg,(.+)\)/', $gradient, $matches );
	$angle  = $matches[1];
	$colors = explode( ',', $matches[2] );

	// SVGの<stop>タグを生成
	$stops = array();
	foreach ( $colors as $color ) {
		preg_match( '/(rgb\(.+\)) (\d+)%/', trim( $color ), $color_matches );
		$stops[] = sprintf( '<stop offset="%d%%" stop-color="%s" />', $color_matches[2], $color_matches[1] );
	}

	// <linearGradient>タグを生成
	$svg = sprintf(
		'<defs>
            <linearGradient id="grad1" x1="0%%" y1="0%%" x2="100%%" y2="0%%" gradientTransform="rotate(%d)">
                %s
            </linearGradient>
        </defs>',
		$angle,
		implode( "\n", $stops )
	);

	return $svg;
}


/**
 * Render_post_icon
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 * @return string $block_content block_content.
 */
function render_block_mone_icon( $block_content, $parsed_block ) {

	return $block_content;
}
add_filter( 'render_block_mone/icon', __NAMESPACE__ . '\render_block_mone_icon', 10, 2 );


/**
 * Registers the `mone/icon` block on the server.
 *
 * @return void
 */
function register_block() {
	register_block_type( __DIR__ );
}
add_action( 'init', __NAMESPACE__ . '\register_block' );
