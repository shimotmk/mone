<?php
/**
 * Registers the `mone/github-embed` block.
 *
 * @package mone
 */

namespace Mone_Theme\Github_Embed;

const GitHub_LOGO_SVG = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>';

/**
 * Fetch GitHub file content
 * 
 * @param string $api_url GitHub API URL
 * @return array
 */
function fetch_github_file_content( $api_url ) {
	$options  = array(
		'http' => array(
			'header' => "User-Agent: PHP\r\n",
		),
	);
	$context  = stream_context_create( $options );
	$response = file_get_contents( $api_url, false, $context );
	return json_decode( $response, true );
}

/**
 * Parse GitHub URL
 * 
 * @param string $url GitHub URL
 * @return object
 */
function parse_github_url( $url ) {
	$parsed_url = parse_url( $url );
	$path       = explode( '/', $parsed_url['path'] );
	$owner      = $path[1];
	$repo       = $path[2];
	$branch     = $path[4];
	$file_path  = implode( '/', array_slice( $path, 5 ) );
	preg_match( '/#L(\d+)(?:-L(\d+))?/', $url, $matches );
	$start_line   = (int) $matches[1];
	$end_line     = isset( $matches[2] ) ? (int) $matches[2] : $start_line;
	$branch_short = substr( $branch, 0, 7 );

	return (object) array(
		'owner'        => $owner,
		'repo'         => $repo,
		'branch'       => $branch,
		'file_path'    => $file_path,
		'start_line'   => $start_line,
		'end_line'     => $end_line,
		'branch_short' => $branch_short,
	);
}

/**
 * Get code from GitHub URL
 * 
 * @param string $url GitHub URL
 * @return array|string
 */
function get_github_code( $url ) {
	$parsed_url = parse_github_url( $url );
	$api_url    = "https://api.github.com/repos/{$parsed_url->owner}/{$parsed_url->repo}/contents/{$parsed_url->file_path}?ref={$parsed_url->branch}";
	$data       = fetch_github_file_content( $api_url );

	if ( isset( $data['content'] ) ) {
		$file_content = base64_decode( $data['content'] );
		$lines        = explode( "\n", $file_content );
		return array_slice( $lines, $parsed_url->start_line - 1, $parsed_url->end_line - $parsed_url->start_line + 1 );
	}
	return 'ファイル内容を取得できませんでした。';
}

/**
 * Embed render callback
 *
 * @param array  $attributes Block attributes.
 * @param string $content Inner content.
 * @return string
 */
function mone_render_callback( $attributes, $content ) {
	$url                   = 'https://github.com/WordPress/wordpress-develop/blob/7d3ce7a591eb8fe85e626a1e288d5c1528a54321/src/wp-includes/class-wp-theme.php#L178-L196';
	$url				   = 'https://github.com/WordPress/wordpress-develop/blob/ed1f411c564f79d003de8babb485884d0a71caa2/src/wp-admin/edit-form-blocks.php#L277-L296';
	$parsed_url            = parse_github_url( $url );
	$extract_path_from_url = "{$parsed_url->owner}/{$parsed_url->repo}/{$parsed_url->file_path}";
	$code_lines            = get_github_code( $url );

	if ( is_string( $code_lines ) ) {
		return $code_lines;
	}

	$line_numbers      = range( $parsed_url->start_line, $parsed_url->end_line );
	$line_number_spans = array_map(
		function ( $line_number ) {
			return "<span>{$line_number}</span>";
		},
		$line_numbers
	);

	$code_snippet = implode( "\n", array_map( 'htmlspecialchars', $code_lines ) );

	$content = '
<div class="embed-github-head-meta">

<div class="embed-github-head-meta_icon">
	' . GitHub_LOGO_SVG . '
</div>

<div class="embed-github-head-meta_body">
    <p class="embed-github-head-meta_url">
    <a href="' . $url . '" target="_blank" rel="noreferrer noodivener">' . $extract_path_from_url . '</a>
    </p>
    <p class="embed-github-head-meta_line">
    Lines ' . $parsed_url->start_line . ' to ' . $parsed_url->end_line . ' in ' . $parsed_url->branch_short . '
    </p>
</div>

</div>
<pre class="embed-github-pre language-php">
<div class="embed-github-line-numbers">' . implode( "\n", $line_number_spans ) . '</div>
<code class="embed-github-code prism-code language-php">' . $code_snippet . '</code>
</pre>
';

	$wrapper_attributes = get_block_wrapper_attributes();
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
			'render_callback' => __NAMESPACE__ . '\mone_render_callback',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_embed' );
