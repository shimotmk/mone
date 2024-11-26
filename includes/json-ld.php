<?php
/**
 * 構造化データ出力関数
 *
 * @package mone
 */

namespace Mone_Theme\Json_Ld;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 構造化データ出力
 */
function output_json() {
	$output = array();

	if ( is_single() || is_page() ) {
		$output[] = mone_article_json();
	}

	foreach ( $output as $json_ld ) {
		echo '<script type="application/ld+json">' . wp_json_encode( $json_ld ) . '</script>' . "\n";
	}
}
add_action( 'wp_footer', __NAMESPACE__ . '\output_json' );

/**
 * 投稿・固定ページの構造化データを生成
 *
 * @return array $json_article json_article.
 */
function mone_article_json() {
	global $post;

	$post_id     = $post->ID;
	$author_id   = $post->post_author;
	$url         = home_url();
	$page_url    = get_permalink( $post_id );
	$headline    = get_the_title( $post_id );
	$description = get_the_excerpt( $post_id );
	$site_name   = get_bloginfo( 'name' );
	$author_name = get_the_author_meta( 'display_name', $author_id );

	$thumb_url = '';
	if ( has_post_thumbnail( $post_id ) ) {
		$thumb_url = get_the_post_thumbnail_url( $post_id, 'full' ) ?? null;
	}

	$logo_img = '';
	if ( has_custom_logo() ) {
		$logo_id  = get_theme_mod( 'custom_logo' );
		$logo_img = wp_get_attachment_image_src( $logo_id, 'full' )[0];
	}

	$json_article = array(
		'@context'         => 'http://schema.org',
		'@type'            => 'Article',
		'mainEntityOfPage' => esc_url( $page_url ),
		'headline'         => $headline,
		'image'            => array(
			'@type' => 'ImageObject',
			'url'   => esc_url( $thumb_url ),
		),
		'datePublished'    => get_the_date( DATE_ISO8601 ),
		'dateModified'     => get_the_modified_date( DATE_ISO8601 ),
		'author'           => array(
			'@type' => 'Person',
			'name'  => $author_name,
			'url'   => $url,
		),
		'publisher'        => array(
			'@type' => 'Organization',
			'name'  => $site_name,
			'logo'  => array(
				'@type' => 'ImageObject',
				'url'   => esc_url( $logo_img ),
			),
		),
		'description'      => $description,
	);

	return $json_article;
}
