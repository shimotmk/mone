<?php
/**
 * Position
 *
 * @package mone
 */

namespace Mone_Theme\Position;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add position to theme.json
 *
 * @param object $theme_json Theme JSON.
 * @return object $theme_json Theme JSON.
 */
function add_position_theme_json_theme( $theme_json ) {
	$get_data          = $theme_json->get_data();
	$add_position      = array(
		'fixed' => true,
	);
	$existing_position = isset( $get_data['settings']['position'] ) ? $get_data['settings']['position'] : array();
	$add_data          = array_merge(
		$existing_position,
		$add_position
	);
	$new_data          = array(
		'version'  => 3,
		'settings' => array(
			'position' => $add_data,
		),
	);
	return $theme_json->update_with( $new_data );
}
add_filter( 'wp_theme_json_data_theme', __NAMESPACE__ . '\add_position_theme_json_theme' );
