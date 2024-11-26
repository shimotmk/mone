<?php
/**
 * Site logo
 *
 * @package mone
 */

namespace Mone_Theme\Site_Logo;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add supports
 *
 * @param array $parsed_block parsed_block.
 * @return array
 */
function set_default_custom_logo( $parsed_block ) {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $parsed_block;
	}

	if ( 'core/site-logo' === $parsed_block['blockName'] && '' === get_custom_logo() ) {
		$parsed_block['attrs']['style']['color']['duotone'] = 'var:preset|duotone|key';
		add_filter(
			'get_custom_logo',
			function () {
				return '<a href="' . get_home_url() . '" class="custom-logo-link" rel="home"><img width="180" height="60" src="' . MONE_TEMPLATE_DIR_URL . '/assets/images/mone-logo.png' . '" class="custom-logo" alt="mone"></a>';
			}
		);
	}

	return $parsed_block;
}
add_filter( 'render_block_data', __NAMESPACE__ . '\set_default_custom_logo' );
