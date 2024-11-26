<?php
/**
 * FrontEnd
 *
 * @package mone
 */

namespace Mone_Theme\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue_style_utils
 */
function enqueue_block_utils() {
	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/utils/index.asset.php';
	if ( is_admin() ) {
		wp_enqueue_style(
			'mone/utils-editor',
			MONE_TEMPLATE_DIR_URL . '/build/utils/index.css',
			array(),
			$asset_file['version']
		);
	}

	wp_enqueue_style(
		'mone/utils',
		MONE_TEMPLATE_DIR_URL . '/build/utils/style-index.css',
		array(),
		$asset_file['version']
	);
	if ( ! is_admin() ) {
		wp_add_inline_style(
			'mone/utils',
			'@media screen and (min-width: 768px){
				.mone-pc-none {
					display: none!important;
				}
			}
			@media screen and (max-width: 768px){
				.mone-sp-none {
					display: none!important;
				}
			}'
		);
	}
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_utils' );
