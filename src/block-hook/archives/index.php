<?php
/**
 * Archives
 *
 * @package mone
 */

namespace Mone_Theme\Archives;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Init
 */
function init() {
	register_block_style(
		'core/archives',
		array(
			'name'       => 'mone-archives-list-unstyled',
			'label'      => __( 'Archives List Unstyled', 'mone' ),
			'style_data' => array(
				'color'      => '#32549e',
				'spacing'    => array(
					'padding' => array(
						'bottom' => '0',
						'left'   => '20px',
						'right'  => '0',
						'top'    => '0',
					),
				),
				'typography' => array(
					'lineHeight' => '55px',
				),
				'elements'   => array(
					'link' => array(
						'color'      => array(
							'text' => 'var(--wp--preset--color--content-contrast-2)',
						),
						'typography' => array(
							'fontWeight' => '400',
						),
					),
				),
				'css'        => 'list-style-type: none; & > li { border-top: 1px dotted var(--wp--preset--color--content-contrast-2); padding: 0 0 0 20px; line-height: 55px; }',
			),
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\init' );
