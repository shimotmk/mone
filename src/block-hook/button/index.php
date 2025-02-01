<?php
/**
 * Button
 *
 * @package mone
 */

namespace Mone_Theme\Button;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render_post_button
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @param object $instance instance.
 */
function render_block_button( $block_content, $block, $instance ) {
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $block_content;
	}

	global $post;
	$post->ID;
	$post_id = isset( $instance->context['postId'] ) ? $instance->context['postId'] : $post->ID;

	if ( ! isset( $block['attrs']['moneShareProviderNameSlug'] ) ) {
		return $block_content;
	}

	if ( isset( $block['attrs']['tagName'] ) && 'button' !== $block['attrs']['tagName'] ) {
		return $block_content;
	}

	$url   = get_the_permalink( $post_id );
	$title = get_the_title();
	$title = apply_filters( 'mone_sharer_text', get_the_title() );

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag( 'button' ) ) {
		$facebook_share_url  = 'https://www.facebook.com/sharer/sharer.php?u=' . $url;
		$x_share_url         = 'https://x.com/share?text=' . $title . '&url=' . $url;
		$hatebu_share_url    = 'https://b.hatena.ne.jp/add?mode=confirm&url=' . $url;
		$getpocket_share_url = 'https://getpocket.com/edit?url=' . $url . '&title=' . $title;
		$line_share_url      = 'https://social-plugins.line.me/lineit/share?url=' . $url . ';text=' . $title;

		$p->set_attribute( 'data-wp-interactive', 'mone/share-button' );
		if ( 'facebook' === $block['attrs']['moneShareProviderNameSlug'] ) {
			$p->set_attribute( 'value', $facebook_share_url );
			$p->set_attribute( 'data-wp-on--click', 'mone/share-button::actions.navigate' );
		} elseif ( 'x' === $block['attrs']['moneShareProviderNameSlug'] ) {
			$p->set_attribute( 'value', $x_share_url );
			$p->set_attribute( 'data-wp-on--click', 'mone/share-button::actions.navigate' );
		} elseif ( 'hatena' === $block['attrs']['moneShareProviderNameSlug'] ) {
			$p->set_attribute( 'value', $hatebu_share_url );
			$p->set_attribute( 'data-wp-on--click', 'mone/share-button::actions.navigate' );
		} elseif ( 'line' === $block['attrs']['moneShareProviderNameSlug'] ) {
			$p->set_attribute( 'value', $line_share_url );
			$p->set_attribute( 'data-wp-on--click', 'mone/share-button::actions.navigate' );
		} elseif ( 'getpocket' === $block['attrs']['moneShareProviderNameSlug'] ) {
			$p->set_attribute( 'value', $getpocket_share_url );
			$p->set_attribute( 'data-wp-on--click', 'mone/share-button::actions.navigate' );
		} elseif ( 'copy' === $block['attrs']['moneShareProviderNameSlug'] ) {
			wp_enqueue_script( 'clipboard' );
			$p->add_class( 'mone-copy-button' );
			$p->set_attribute( 'data-clipboard-text', $url );
			$p->set_attribute( 'data-clipboard-action', 'copy' );
			$p->set_attribute( 'data-wp-on--click', 'actions.clickCopy' );
			$p->set_attribute( 'data-wp-context', '{ "Copied": false }' );
			$p->set_attribute( 'data-wp-class--copied', 'context.Copied' );

			$existing_style = $p->get_attribute( 'style' );
			$updated_style  = '';
			if ( ! empty( $existing_style ) ) {
				$updated_style = $existing_style;
				if ( ! str_ends_with( $existing_style, ';' ) ) {
					$updated_style .= ';';
				}
			}

			$updated_style .= '--copy-message: "' . __( 'URL copied!', 'mone' ) . '";';
			$p->set_attribute( 'style', $updated_style );
		}
	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/button', __NAMESPACE__ . '\render_block_button', 10, 3 );

/**
 * Render_post_button
 *
 * @param string $block_content block_content.
 * @param array  $block block.
 * @return string $block_content block_content.
 */
function render_block_appreciate_button( $block_content, $block ) {
	if ( ! isset( $block['attrs']['moneAppreciateAnimationImageUrl'] ) ) {
		return $block_content;
	}

	if ( isset( $block['attrs']['tagName'] ) && 'button' !== $block['attrs']['tagName'] ) {
		return $block_content;
	}

	$img_existing_style = '';
	$img_existing_class = '';
	$p                  = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag( 'button' ) ) {
		// 一つ目のインライン画像をhand imageにする.
		if ( $p->next_tag( 'img' ) ) {
			$p->add_class( 'mone-hand-image' );
			$img_existing_style = $p->get_attribute( 'style' );
			$img_existing_class = $p->get_attribute( 'class' );
		}
	}
	$block_content = $p->get_updated_html();

	$img_id = null;
	if ( preg_match( '/wp-image-(\d+)/', $img_existing_class, $matches ) ) {
		$img_id = $matches[1];
	}
	$metadata        = wp_get_attachment_metadata( $img_id );
	$original_width  = isset( $metadata['width'] ) ? $metadata['width'] : null;
	$original_height = isset( $metadata['height'] ) ? $metadata['height'] : null;
	if ( $original_width && $original_height ) {
		$aspect_ratio = $original_height / $original_width;
	} else {
		$aspect_ratio = 1;
	}

	if ( preg_match( '/width\s*:\s*([^;]+);?/', $img_existing_style, $matches ) ) {
		$width_with_unit = $matches[1];
		$width           = str_replace( 'px', '', $width_with_unit );
		$width           = trim( $width );
	}
	$height = $width * $aspect_ratio;

	$animation_image = '<img width="' . $width . '" height="' . $height . '" class="mone-animation-image" style="' . $img_existing_style . '" src=" ' . $block['attrs']['moneAppreciateAnimationImageUrl'] . ' " />';

	$block_content = preg_replace(
		'/(<img[^>]*class="[^"]*mone-hand-image[^"]*"[^>]*>)/',
		'<span class="mone-appreciate-image-wrapper" style="width: ' . $width . 'px ; height: ' . $height . 'px">' . $animation_image . '$1</span>',
		$block_content
	);

	return $block_content;
}
add_filter( 'render_block_core/button', __NAMESPACE__ . '\render_block_appreciate_button', 10, 2 );
