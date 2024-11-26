<?php
/**
 * Preformatted
 *
 * @package mone
 */

namespace Mone_Theme\Preformatted;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register_block_style
 */
function init() {
	register_block_style(
		'core/preformatted',
		array(
			'name'       => 'mone-pre-scrollable',
			'label'      => __( 'Pre scrollable', 'mone' ),
			'style_data' => array(
				'css' => 'white-space: nowrap;overflow-x: auto;',
			),
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\init' );
