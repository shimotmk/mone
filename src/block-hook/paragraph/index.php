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
	$class_name = $parsed_block['attrs']['className'] ?? '';
	if ( ! $class_name || ! str_contains( $class_name, 'is-style-mone-alert-' ) ) {
		return $block_content;
	}

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

		if ( isset( $parsed_block['attrs']['style']['spacing']['padding']['top'] ) ) {
			$top = $parsed_block['attrs']['style']['spacing']['padding']['top'];
			$top = is_string( $top ) ? $top : '';
			$top = $top && preg_match( '%[\\\(&=}]|/\*%', $top ) ? null : $top;
			if ( is_string( $top ) && str_contains( $top, 'var:preset|spacing|' ) ) {
				$index_to_splice = strrpos( $top, '|' ) + 1;
				$slug            = _wp_to_kebab_case( substr( $top, $index_to_splice ) );
				$top             = "var(--wp--preset--spacing--$slug)";
			}

			if ( '0' === $top ) {
				$updated_style .= '--the-alert-icon-padding-top-custom: 0px;';
			} else {
				$updated_style .= '--the-alert-icon-padding-top-custom: ' . $top . ';';
			}
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
				$updated_style  = preg_replace( '/padding-left:\s*[^;]+;/', '', $updated_style );
				$updated_style .= 'padding-left: calc( ( var(--the-alert-font-size, var(--wp--preset--font-size--medium)) * 1.5 ) + var(--the-alert-icon-text-gap) );';
			} else {
				$updated_style .= '--the-alert-icon-padding-left-custom: ' . $left . ';';
				$updated_style  = preg_replace( '/padding-left:\s*[^;]+;/', '', $updated_style );
				$updated_style .= 'padding-left: calc( var(--the-alert-icon-padding-left-custom, var(--wp--preset--spacing--10) ) + ( var(--the-alert-font-size, var(--wp--preset--font-size--medium)) * 1.5 ) + var(--the-alert-icon-text-gap) );';
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
			'icon_svg'   => 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2268%22%20height%3D%2268%22%20fill%3D%22%23000000%22%20viewBox%3D%220%200%20256%20256%22%3E%3Cpath%20d%3D%22M128%2C24A104%2C104%2C0%2C1%2C0%2C232%2C128%2C104.11%2C104.11%2C0%2C0%2C0%2C128%2C24Zm0%2C192a88%2C88%2C0%2C1%2C1%2C88-88A88.1%2C88.1%2C0%2C0%2C1%2C128%2C216Zm-8-80V80a8%2C8%2C0%2C0%2C1%2C16%2C0v56a8%2C8%2C0%2C0%2C1-16%2C0Zm20%2C36a12%2C12%2C0%2C1%2C1-12-12A12%2C12%2C0%2C0%2C1%2C140%2C172Z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
		),
		'mone-alert-yellow' => array(
			'label'      => __( 'Alert yellow', 'mone' ),
			'background' => '#fff6e4',
			'text'       => '#000000b3',
			'icon_color' => '#ffb84c',
			'icon_svg'   => 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2268%22%20height%3D%2268%22%20fill%3D%22%23000000%22%20viewBox%3D%220%200%20256%20256%22%3E%3Cpath%20d%3D%22M236.8%2C188.09%2C149.35%2C36.22h0a24.76%2C24.76%2C0%2C0%2C0-42.7%2C0L19.2%2C188.09a23.51%2C23.51%2C0%2C0%2C0%2C0%2C23.72A24.35%2C24.35%2C0%2C0%2C0%2C40.55%2C224h174.9a24.35%2C24.35%2C0%2C0%2C0%2C21.33-12.19A23.51%2C23.51%2C0%2C0%2C0%2C236.8%2C188.09ZM222.93%2C203.8a8.5%2C8.5%2C0%2C0%2C1-7.48%2C4.2H40.55a8.5%2C8.5%2C0%2C0%2C1-7.48-4.2%2C7.59%2C7.59%2C0%2C0%2C1%2C0-7.72L120.52%2C44.21a8.75%2C8.75%2C0%2C0%2C1%2C15%2C0l87.45%2C151.87A7.59%2C7.59%2C0%2C0%2C1%2C222.93%2C203.8ZM120%2C144V104a8%2C8%2C0%2C0%2C1%2C16%2C0v40a8%2C8%2C0%2C0%2C1-16%2C0Zm20%2C36a12%2C12%2C0%2C1%2C1-12-12A12%2C12%2C0%2C0%2C1%2C140%2C180Z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
		),
		'mone-alert-blue'   => array(
			'label'      => __( 'Alert blue', 'mone' ),
			'background' => '#E9F8FF',
			'text'       => '#000000b3',
			'icon_color' => '#299ADE',
			'icon_svg'   => 'data:image/svg+xml,%3Csvg%20width%3D%22252%22%20height%3D%22252%22%20viewBox%3D%220%200%20252%20252%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7.875%20118.125C7.88803%20105.598%2012.8703%2093.5871%2021.7286%2084.7288C30.5869%2075.8706%2042.5975%2070.8883%2055.125%2070.8752H94.3031C97.1677%2070.7079%20147.085%2067.1937%20194.621%2027.3265C196.916%2025.3986%20199.714%2024.1659%20202.686%2023.773C205.658%2023.3802%20208.68%2023.8436%20211.398%2025.1089C214.115%2026.3741%20216.415%2028.3886%20218.028%2030.9157C219.64%2033.4428%20220.498%2036.3776%20220.5%2039.3752V196.875C220.5%20199.874%20219.643%20202.81%20218.032%20205.338C216.42%20207.867%20214.12%20209.883%20211.402%20211.149C208.684%20212.416%20205.661%20212.88%20202.689%20212.488C199.716%20212.095%20196.917%20210.862%20194.621%20208.934C157.441%20177.749%20118.824%20168.811%20102.375%20166.31V197.535C102.378%20200.13%20101.74%20202.686%20100.517%20204.975C99.2947%20207.264%2097.5252%20209.216%2095.3663%20210.656L84.5381%20217.872C82.4452%20219.269%2080.048%20220.144%2077.5474%20220.424C75.0467%20220.704%2072.5153%20220.381%2070.1653%20219.482C67.8152%20218.582%2065.7148%20217.133%2064.04%20215.255C62.3652%20213.377%2061.1647%20211.125%2060.5391%20208.688L48.953%20165.021C37.5861%20163.508%2027.1552%20157.92%2019.5995%20149.294C12.0438%20140.668%207.8774%20129.592%207.875%20118.125ZM204.75%20196.806V39.3752C162.609%2074.7241%20119.474%2083.6721%20102.375%2085.8771V150.334C119.454%20152.578%20162.579%20161.507%20204.75%20196.806ZM75.7969%20204.681V204.79L86.625%20197.574V165.375H65.3625L75.7969%20204.681ZM55.125%20149.625H86.625V86.6252H55.125C46.7707%2086.6252%2038.7585%2089.944%2032.8511%2095.8514C26.9437%20101.759%2023.625%20109.771%2023.625%20118.125C23.625%20126.48%2026.9437%20134.492%2032.8511%20140.399C38.7585%20146.306%2046.7707%20149.625%2055.125%20149.625Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E',
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
                    --the-alert-icon-text-gap: calc( var(--the-alert-font-size, var(--wp--preset--font-size--medium)) / 2 );
                    padding-left: calc( var(--wp--preset--spacing--10) + ( var(--the-alert-font-size, var(--wp--preset--font-size--medium)) * 1.5 ) + var(--the-alert-icon-text-gap) );
                    &::before{ 
                    --the-alert-icon-color: var(--the-alert-icon-color-custom, {$style['icon_color']});
                    --the-alert-icon-size: var(--the-alert-font-size, var(--wp--preset--font-size--medium));
                    --the-alert-icon-padding-top: var(--the-alert-icon-padding-top-custom, var(--wp--preset--spacing--10));
                    --the-alert-icon-padding-left: calc( var(--the-alert-icon-padding-left-custom, calc(var(--wp--preset--spacing--10))) + ( var(--the-alert-font-size, var(--wp--preset--font-size--medium)) * 1.5 ) );
                    --the-alert-icon: var(--the-alert-icon-custom, url('{$style['icon_svg']}')); 
                    content: ''; 
                    display: inline-block; 
                    position: absolute; 
                    top: var(--the-alert-icon-padding-top); 
                    left: var(--the-alert-icon-padding-left); 
                    transform: translate(-100%, 50%) scale(1.5); 
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
