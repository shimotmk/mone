<?php
/**
 * Registers the `mone/embed` block.
 *
 * @package mone
 */

/**
 * Embed render callback
 *
 * @param array  $attributes Block attributes.
 * @param string $content Inner content.
 * @return string
 */
function mone_render_callback( $attributes, $content ) {
	if ( ! isset( $attributes['url'] ) ) {
		return null;
	}

	$data         = Mone_Embed_Url::get_embed_data( $attributes['url'] );
	$cannot_embed = ! empty( $data['cannot_embed'] ) ? $data['cannot_embed'] : false;
	$link_target  = $attributes['linkTarget'] ?? '_self';
	$link_rel     = $attributes['rel'] ?? '';

	if ( $attributes['isLink'] ) {
		$p = new \WP_HTML_Tag_Processor( $content );
		if ( $p->next_tag() ) {
			$p->add_class( 'is-whole-linked' );
		}
		$content = $p->get_updated_html();

		$link_markup = sprintf(
			'<a class="wp-block-mone-embed__link" href="%1$s" target="%2$s" rel="%3$s" aria-hidden="true" tabindex="-1">&nbsp;</a>',
			esc_url( $attributes['url'] ),
			esc_attr( $link_target ),
			esc_attr( $link_rel )
		);
		$content     = preg_replace(
			'/^\s*<(\w+)([^>]*)>/m',
			'<$1$2>' . $link_markup,
			$content,
			1
		);
	}

	if ( $cannot_embed ) {
		$wrapper_attributes = get_block_wrapper_attributes();
		$content            = $attributes['url'];
		return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $content );
	}

	return $content;
}

/**
 * Registers the `mone/embed` block on the server.
 *
 * @return void
 */
function mone_register_block_embed() {
	register_block_type(
		__DIR__,
		array(
			'render_callback' => 'mone_render_callback',
		)
	);
}
add_action( 'init', 'mone_register_block_embed' );
