<?php
/**
 * Paragraph
 *
 * @package mone
 */

namespace Mone_Theme\Paragraph;
use function Mone_Theme\UtilsFunc\mone_is_hex_color;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render block post date
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 *
 * @return string
 */
function render_block_paragraph( $block_content, $parsed_block ) {
	$alert_icon_url          = $parsed_block['attrs']['moneAlertIcon'] ?? '';
	$alert_icon_color_custom = isset( $parsed_block['attrs']['moneIconGradient'] )
	? 'var(--wp--preset--gradient--' . $parsed_block['attrs']['moneIconGradient'] . ')'
	: ( $parsed_block['attrs']['moneIconCustomGradient'] ?? ( isset( $parsed_block['attrs']['moneAlertIconColor'] ) && mone_is_hex_color( $parsed_block['attrs']['moneAlertIconColor'] )
		? $parsed_block['attrs']['moneAlertIconColor']
		: ( isset( $parsed_block['attrs']['moneAlertIconColor'] ) ? 'var(--wp--preset--color--' . $parsed_block['attrs']['moneAlertIconColor'] . ')' : '' ) ) );

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag() ) {

		$existing_style = $p->get_attribute( 'style' );
		$updated_style  = '';
		if ( ! empty( $existing_style ) ) {
			$updated_style = $existing_style;
			if ( ! str_ends_with( $existing_style, ';' ) ) {
				$updated_style .= ';';
			}
		}

		if ( ! empty( $alert_icon_url ) ) {
			$updated_style .= '--the-alert-icon-custom: url(' . $alert_icon_url . ');';
		}
		if ( ! empty( $alert_icon_color_custom ) ) {
			$updated_style .= '--the-alert-icon-color-custom: ' . $alert_icon_color_custom . ';';
		}

		$has_named_font_size = ! empty( $parsed_block['attrs']['fontSize'] );
		if ( $has_named_font_size ) {
			$updated_style .= '--the-alert-font-size: var(--wp--preset--font-size--' . $parsed_block['attrs']['fontSize'] . ');';
		}
		if ( ! empty( $parsed_block['attrs']['style']['typography']['fontSize'] ) ) {
			$typography_styles = wp_get_typography_font_size_value(
				array(
					'size' => $parsed_block['attrs']['style']['typography']['fontSize'],
				)
			);
			$updated_style    .= '--the-alert-font-size: ' . $typography_styles . ';';
		}

		if ( ! empty( $parsed_block['attrs']['style']['spacing']['padding']['top'] ) ) {
			$top = $parsed_block['attrs']['style']['spacing']['padding']['top'];
			$top = is_string( $top ) ? $top : '';
			$top = $top && preg_match( '%[\\\(&=}]|/\*%', $top ) ? null : $top;
			if ( is_string( $top ) && str_contains( $top, 'var:preset|spacing|' ) ) {
				$index_to_splice = strrpos( $top, '|' ) + 1;
				$slug            = _wp_to_kebab_case( substr( $top, $index_to_splice ) );
				$top             = "var(--wp--preset--spacing--$slug)";
			}
			$updated_style .= '--the-alert-icon-padding-top-custom: ' . $top . ';';
		}

		if ( isset( $parsed_block['attrs']['style']['spacing']['padding']['left'] ) ) {
			$left = $parsed_block['attrs']['style']['spacing']['padding']['left'];
			$left = is_string( $left ) ? $left : '';
			$left = $left && preg_match( '%[\\\(&=}]|/\*%', $left ) ? null : $left;
			if ( is_string( $left ) && str_contains( $left, 'var:preset|spacing|' ) ) {
				$index_to_splice = strrpos( $left, '|' ) + 1;
				$slug            = _wp_to_kebab_case( substr( $left, $index_to_splice ) );
				$left            = "var(--wp--preset--spacing--$slug)";
			}

			if ( '0' === $left ) {
				$updated_style .= '--the-alert-icon-padding-left-custom: 0px;';
				$updated_style .= 'padding-left: calc( var(--the-alert-font-size, var(--wp--preset--font-size--medium)) + var(--the-alert-icon-text-gap) );';
			} else {
				$updated_style .= '--the-alert-icon-padding-left-custom: ' . $left . ';';
				$updated_style .= 'padding-left: calc( var( --the-alert-icon-padding-left-custom, calc(var(--wp--preset--spacing--10) )) + var(--the-alert-font-size, var(--wp--preset--font-size--medium)) + var(--the-alert-icon-text-gap) );';
			}
		}

		$p->set_attribute( 'style', $updated_style );
	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/paragraph', __NAMESPACE__ . '\render_block_paragraph', 10, 2 );

/**
 * Init
 */
function init() {
	$alert_styles = array(
		'mone-alert-red'    => array(
			'label'      => __( 'Alert red', 'mone' ),
			'background' => '#ffeff2',
			'text'       => '#000000b3',
			'icon_color' => '#ff7670',
		),
		'mone-alert-yellow' => array(
			'label'      => __( 'Alert yellow', 'mone' ),
			'background' => '#fff6e4',
			'text'       => '#000000b3',
			'icon_color' => '#ffb84c',
		),
		'mone-alert-blue'   => array(
			'label'      => __( 'Alert blue', 'mone' ),
			'background' => '#E9F8FF',
			'text'       => '#000000b3',
			'icon_color' => '#299ADE',
		),
	);

	foreach ( $alert_styles as $name => $style ) {
		register_block_style(
			'core/paragraph',
			array(
				'name'       => $name,
				'label'      => $style['label'],
				'style_data' => array(
					'color'   => array(
						'background' => $style['background'],
						'text'       => $style['text'],
					),
					'spacing' => array(
						'padding' => array(
							'bottom' => 'var(--wp--preset--spacing--10)',
							'right'  => 'var(--wp--preset--spacing--10)',
							'top'    => 'var(--wp--preset--spacing--10)',
						),
					),
					'css'     => "
                    position: relative; 
                    --the-alert-icon-text-gap: 5px;
                    padding-left: calc(var(--wp--preset--spacing--10) + var(--the-alert-font-size, var(--wp--preset--font-size--medium)) + var(--the-alert-icon-text-gap));
                    &::before{ 
                    --the-alert-icon-color: var( --the-alert-icon-color-custom, {$style['icon_color']});
                    --the-alert-icon-size: var( --the-alert-font-size, var(--wp--preset--font-size--medium));
                    --the-alert-icon-padding-top: var( --the-alert-icon-padding-top-custom, var(--wp--preset--spacing--10));
                    --the-alert-icon-padding-left: calc( var( --the-alert-icon-padding-left-custom, calc(var(--wp--preset--spacing--10) )) + var(--the-alert-font-size, var(--wp--preset--font-size--medium)) );
                    --the-alert-icon: var(--the-alert-icon-custom, url('data:image/svg+xml,%3Csvg%20width%3D%2226%22%20height%3D%2226%22%20viewBox%3D%220%200%2026%2026%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.75%200.25C10.2777%200.25%207.86099%200.983112%205.80538%202.35663C3.74976%203.73015%202.14761%205.68238%201.20151%207.96646C0.255416%2010.2505%200.00787441%2012.7639%200.49019%2015.1886C0.972505%2017.6134%202.16301%2019.8407%203.91117%2021.5888C5.65933%2023.337%207.88661%2024.5275%2010.3114%2025.0098C12.7361%2025.4921%2015.2495%2025.2446%2017.5335%2024.2985C19.8176%2023.3524%2021.7699%2021.7502%2023.1434%2019.6946C24.5169%2017.639%2025.25%2015.2223%2025.25%2012.75C25.2465%209.43587%2023.9284%206.25848%2021.585%203.91503C19.2415%201.57158%2016.0641%200.2535%2012.75%200.25ZM11.7885%206.98077C11.7885%206.72575%2011.8898%206.48118%2012.0701%206.30086C12.2504%206.12053%2012.495%206.01923%2012.75%206.01923C13.005%206.01923%2013.2496%206.12053%2013.4299%206.30086C13.6102%206.48118%2013.7115%206.72575%2013.7115%206.98077V13.7115C13.7115%2013.9666%2013.6102%2014.2111%2013.4299%2014.3914C13.2496%2014.5718%2013.005%2014.6731%2012.75%2014.6731C12.495%2014.6731%2012.2504%2014.5718%2012.0701%2014.3914C11.8898%2014.2111%2011.7885%2013.9666%2011.7885%2013.7115V6.98077ZM12.75%2019.4808C12.4647%2019.4808%2012.1859%2019.3962%2011.9487%2019.2377C11.7115%2019.0792%2011.5266%2018.854%2011.4175%2018.5904C11.3083%2018.3269%2011.2798%2018.0369%2011.3354%2017.7571C11.3911%2017.4773%2011.5284%2017.2203%2011.7301%2017.0186C11.9318%2016.8169%2012.1888%2016.6795%2012.4686%2016.6239C12.7484%2016.5682%2013.0384%2016.5968%2013.3019%2016.7059C13.5655%2016.8151%2013.7908%2017%2013.9492%2017.2372C14.1077%2017.4743%2014.1923%2017.7532%2014.1923%2018.0385C14.1923%2018.421%2014.0404%2018.7878%2013.7699%2019.0583C13.4994%2019.3288%2013.1325%2019.4808%2012.75%2019.4808Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E')); 
                    content: ''; 
                    display: inline-block; 
                    position: absolute; 
                    top: var(--the-alert-icon-padding-top); 
                    left: var(--the-alert-icon-padding-left); 
                    transform: translate(-100%, 50%); 
                    width: var(--the-alert-icon-size); 
                    min-width: var(--the-alert-icon-size); 
                    height: var(--the-alert-icon-size); 
                    mask-size: contain; 
                    background: var(--the-alert-icon-color); 
                    mask-position: top center; 
                    mask-repeat: no-repeat; 
                    mask-image: var(--the-alert-icon); }",
				),
			)
		);
	}
}
add_action( 'init', __NAMESPACE__ . '\init' );
