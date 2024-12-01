<?php
/**
 * List
 *
 * @package mone
 */

namespace Mone_Theme\List_Block;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register_block_style
 */
function init() {
	register_block_style(
		'core/list',
		array(
			'name'       => 'mone-list-default',
			'label'      => __( 'Mone List', 'mone' ),
			'style_data' => array(
				'border'  => array(
					'color' => 'var(--wp--preset--color--key-2)',
					'style' => 'dashed',
					'width' => '1px',
				),
				'color'   => array(
					'background' => 'var(--wp--preset--color--list-bg)',
				),
				'spacing' => array(
					'padding' => array(
						'bottom' => 'var(--wp--preset--spacing--30)',
						'left'   => 'var(--wp--preset--spacing--50)',
						'right'  => 'var(--wp--preset--spacing--50)',
						'top'    => 'var(--wp--preset--spacing--30)',
					),
				),
				'css'     => 'border-color: var(--wp--preset--color--key-2);border-style: dashed;border-width: 1px;',
			),
		)
	);

	register_block_style(
		'core/list',
		array(
			'name'       => 'mone-list-style-none',
			'label'      => __( 'List style none', 'mone' ),
			'style_data' => array(
				'spacing' => array(
					'padding' => array(
						'bottom' => '0',
						'left'   => '0',
						'right'  => '0',
						'top'    => '0',
					),
				),
				'css'     => 'list-style: none',
			),
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\init' );
