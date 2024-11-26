<?php
/**
 * Registers translate.
 *
 * @package mone
 */

namespace Mone_Theme\Gutenberg;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Mone_icon_script_block
 */
function mone_icon_script_block() {
	$script_handle = 'mone-icon-script';
	wp_set_script_translations( $script_handle, 'mone', MONE_TEMPLATE_DIR_PATH . 'languages' );
	$data_to_pass = array(
		'some_value' => 'This is a value from PHP',
	);
	wp_localize_script( $script_handle, 'moneData', $data_to_pass );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\mone_icon_script_block' );

/**
 * This function modifies the block editor settings to disable inspector tabs
 * for the 'core/button' block.
 *
 * @param array $settings The current block editor settings.
 * @return array          The modified block editor settings.
 */
function disable_inspector_tabs_for_specific_blocks( $settings ) {
	if ( ! isset( $settings['blockInspectorTabs'] ) ) {
		$settings['blockInspectorTabs'] = array();
	}

	$settings['blockInspectorTabs'] = array_merge(
		$settings['blockInspectorTabs'],
		array(
			'core/paragraph' => false,
			'core/heading'   => false,
			'core/button'    => false,
		)
	);

	return $settings;
}
add_filter( 'block_editor_settings_all', __NAMESPACE__ . '\disable_inspector_tabs_for_specific_blocks' );
