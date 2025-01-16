<?php
/**
 * Is-hex-color
 *
 * @package mone
 */

namespace Mone_Theme\UtilsFunc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if the given color is a hex color.
 *
 * @param string $color The color to check.
 * @return bool True if the color is a hex color, false otherwise.
 */
function mone_is_hex_color( $color ) {
	return is_string( $color ) && strpos( $color, '#' ) === 0;
}
