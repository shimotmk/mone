<?php
/**
 * Render_YouTube in Dialog
 *
 * @package mone
 */

namespace Mone_Theme\Group\Dialog\Render_YouTube;
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
function render_youtube_in_dialog( $block_content, $block ) {
	$class_name = isset( $block['attrs']['className'] ) ? $block['attrs']['className'] : '';
	if ( ! exists_class_name( 'mone-dialog-container', $class_name ) ) {
		return $block_content;
	}

	$tag_name = isset( $block['attrs']['tagName'] ) ? $block['attrs']['tagName'] : '';
	if ( 'dialog' !== $tag_name ) {
		return $block_content;
	}

	$asset_file = include MONE_TEMPLATE_DIR_PATH . '/build/block-hook/group/index.asset.php';

	$p = new \WP_HTML_Tag_Processor( $block_content );
	while ( $p->next_tag(
		array(
			'tag_name'   => 'figure',
			'class_name' => 'wp-block-embed-youtube',
		)
	) ) {
		$existing_src = '';
		if ( $p->next_tag(
			array(
				'tag_name'   => 'iframe',
			)
		) ) {
			$existing_src = $p->get_attribute( 'data-src' );
			if ( ! empty( $existing_src ) ) {
				$existing_src = $existing_src . '?enablejsapi=1';
			}

			$p->set_attribute( 'data-src', $existing_src );

			wp_enqueue_script(
				'mone-embed-iframe-script',
				'https://www.youtube.com/iframe_api',
				$asset_file['dependencies'],
				$asset_file['version'],
				true
			);
		}
	}
	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/group', __NAMESPACE__ . '\render_youtube_in_dialog', 10, 2 );
