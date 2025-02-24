<?php
/**
 * Class name
 *
 * @package mone
 */

namespace Mone_Theme\UtilsFunc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class string to array class name.
 *
 * @param string $class_list class_list.
 * @return array class array.
 */
function mone_string_to_array_class_name( $class_list ) {
	if ( is_array( $class_list ) ) {
		return $class_list;
	}
	return $class_list ? explode( ' ', (string) $class_list ) : array();
}

/**
 * Check if specified class exists
 *
 * @param mixed $target_class_list Class to search for.
 * @param mixed $class_list Class list to search in.
 * @return bool True if class exists.
 */
function exists_class_name( $target_class_list, $class_list ) {
	$class_array = mone_string_to_array_class_name( $class_list );
	$targets     = mone_string_to_array_class_name( $target_class_list );
	foreach ( $targets as $target ) {
		if ( in_array( $target, $class_array, true ) ) {
			return true;
		}
	}
	return false;
}
