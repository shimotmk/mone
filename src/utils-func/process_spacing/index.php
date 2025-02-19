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
 * String to wp spacing
 *
 * @param string $spacing The spacing.
 * @return string spacing value.
 */
function mone_process_spacing( $spacing ) {
	if ( ! is_string( $spacing ) || preg_match( '%[\\\(&=}]|/\*%', $spacing ) ) {
		return null;
	}
	if ( str_contains( $spacing, 'var:preset|spacing|' ) ) {
		$index_to_splice = strrpos( $spacing, '|' ) + 1;
		$slug            = _wp_to_kebab_case( substr( $spacing, $index_to_splice ) );
		return "var(--wp--preset--spacing--$slug)";
	}
	return $spacing;
}
