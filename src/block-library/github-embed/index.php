<?php
/**
 * Registers the `mone/github-embed` block.
 *
 * @package mone
 */

namespace Mone_Theme\Github_Embed;

const GitHub_LOGO_SVG = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>';

/**
 * Embed render callback
 *
 * @param array  $attributes Block attributes.
 * @param string $content Inner content.
 * @return string
 */
function github_embed_render_callback( $attributes, $content ) {
	$url    = isset( $attributes['url'] ) ? $attributes['url'] : false;
	$height = isset( $attributes['height'] ) ? $attributes['height'] : false;
	if ( ! $url ) {
		return '';
	}
	$data         = \Mone_Github_Embed::get_embed_data( $url );
	$extract_path = $data['extract_path'];
	$start_line   = $data['start_line'];
	$end_line     = $data['end_line'];
	$branch_short = $data['branch_short'];
	$code         = $data['code'];

	$line_numbers      = range( $start_line, $end_line );
	$line_number_spans = array_map(
		function ( $line_number ) {
			return "<span>{$line_number}</span>";
		},
		$line_numbers
	);
	$code_snippet = isset( $code ) && is_array( $code ) ? implode( "\n", array_map( 'htmlspecialchars', $code ) ) : false;

	$content = '
<div class="embed-github-head-meta">

	<div class="embed-github-head-meta_icon">
		' . GitHub_LOGO_SVG . '
	</div>

	<div class="embed-github-head-meta_body">
		<p class="embed-github-head-meta_url">
		<a href="' . $url . '" target="_blank" rel="noreferrer noodivener">' . $extract_path . '</a>
		</p>
		<p class="embed-github-head-meta_line">
		Lines ' . $start_line . ' to ' . $end_line . ' in ' . $branch_short . '
		</p>
	</div>
</div>
';

	if ( $code_snippet ) {
		$style = '';
		if ( $height ) {
			$style = 'height: ' . $height;
		}

		$content .= '
		<pre class="embed-github-pre" style="' . $style . '">
		<div class="embed-github-line-numbers">' . implode( "\n", $line_number_spans ) . '</div>
		<code class="embed-github-code prism-code hljs">' . $code_snippet . '</code>
		</pre>
		';
	}

	$classes = array();
	if ( false === $code_snippet ) {
		$classes[] = 'cannot-embed';
	}
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );
	return sprintf(
		'<div %1$s>%2$s</div>',
		$wrapper_attributes,
		$content
	);
}

/**
 * Registers the `mone/embed-github` block on the server.
 *
 * @return void
 */
function register_block_embed() {
	register_block_type(
		__DIR__,
		array(
			'render_callback' => __NAMESPACE__ . '\github_embed_render_callback',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_embed' );
