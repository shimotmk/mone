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

function mone_convert_linear_gradient_to_svg( $gradient, $id ) {
    if ( ! $gradient ) {
        return null;
    }

    if ( ! preg_match( '/linear-gradient\((\d+)deg,(.+)\)/', $gradient, $matches ) ) {
        return null;
    }

    $angle = $matches[1];
    $colorStops = $matches[2];

    $stopTags = [];
    if ( preg_match_all( '/(rgba?\(.+?\)) (\d+)%/', $colorStops, $colorMatches, PREG_SET_ORDER ) ) {
        foreach ( $colorMatches as $colorMatch ) {
            $color = $colorMatch[1];
            $offset = $colorMatch[2];
            $stopTags[] = sprintf( '<stop offset="%s%%" stop-color="%s" />', $offset, $color );
        }
    }

    $stopTagsString = implode( "\n", $stopTags );

    return sprintf(
        '<svg style="visibility: hidden; height: 0; position: absolute;">
            <defs>
                <linearGradient id="%s" x1="0%%" y1="0%%" x2="100%%" y2="0%%" gradientTransform="rotate(%d)">
                    %s
                </linearGradient>
            </defs>
        </svg>',
        $id,
        $angle,
        $stopTagsString
    );
}

/**
 * Render_post_icon
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 * @return string $block_content block_content.
 */
function render_block_mone_icon( $block_content, $parsed_block ) {
	if ( empty( $parsed_block['attrs']['iconGradientColor'] ) ) {
		return $block_content;
	}

	$icon_gradient_color = isset( $parsed_block['attrs']['iconGradientColor'] ) ? $parsed_block['attrs']['iconGradientColor'] : '';
	$id      = wp_unique_id( 'mone-icon-gradient--' );

	$svg = mone_convert_linear_gradient_to_svg( $icon_gradient_color, $id );
	$block_content = preg_replace( '/<svg/', $svg . '<svg fill="url(#' . $id . ')"', $block_content );

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
