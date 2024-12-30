<?php
/**
 * Heading
 *
 * @package mone
 */

namespace Mone_Theme\Heading;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Init
 */
function init() {
	register_block_style(
		'core/heading',
		array(
			'name'       => 'mone-heading-plane',
			'label'      => __( 'Plane', 'mone' ),
			'style_data' => array(
				'border'  => array(
					'style' => 'solid',
					'width' => '0px',
				),
				'spacing' => array(
					'padding' => array(
						'bottom' => '0',
						'left'   => '0',
						'right'  => '0',
						'top'    => '0',
					),
				),
				'css'     => 'background: inherit;',
			),
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\init' );
