<?php
/**
 * Disable_Lightbox in Dialog
 *
 * @package mone
 */

namespace Mone_Theme\Group\Dialog\Disable_Lightbox;
use function Mone_Theme\UtilsFunc\exists_class_name;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Disable lightbox in dialog block.
 *
 * @param array $block_content block_content.
 * @param array $block block.
 * @return array
 */
function render_image_in_dialog( $block_content, $block ) {
	$class_name = isset( $block['attrs']['className'] ) ? $block['attrs']['className'] : '';
	if ( ! exists_class_name( 'mone-dialog-container', $class_name ) ) {
		return $block_content;
	}

	$tag_name = isset( $block['attrs']['tagName'] ) ? $block['attrs']['tagName'] : '';
	if ( 'dialog' !== $tag_name ) {
		return $block_content;
	}

	$p = new \WP_HTML_Tag_Processor( $block_content );
	while ( $p->next_tag(
		array(
			'tag_name'   => 'figure',
			'class_name' => 'wp-block-image',
		)
	) ) {
		if ( ! $p->has_class( 'mone-dialog-trigger' ) ) {
			$p->remove_attribute( 'data-wp-interactive' );
		}
		$p->remove_class( 'wp-lightbox-container' );
		$p->add_class( 'mone-dialog-inner-image' );
	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/group', __NAMESPACE__ . '\render_image_in_dialog', 10, 2 );
