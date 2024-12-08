<?php
/**
 * Mone_Github_Embed class
 *
 * @package Mone_Github_Embed
 */

if ( class_exists( 'Mone_Github_Embed' ) ) {
	return;
}

/**
 * Mone_Github_Embed
 */
class Mone_Github_Embed {

	/**
	 * Initialize
	 *
	 * @return Mone_Github_Embed
	 */
	public static function init() {
		static $instance                         = null;
		return $instance ? $instance : $instance = new static();
	}


	/**
	 * Get Embed Data
	 *
	 * @param url     $url URL.
	 * @param boolean $clear_cache キャッシュクリアするか否か.
	 * @return array get_embed_data
	 */
	public static function get_embed_data( $url, $clear_cache = false ) {
		// Transient per URL.
		$cache_key = static::build_cache_key_for_url( $url );

		// Attempt to retrieve cached response.
		$cached_response = static::get_cache( $cache_key );

		if ( ! empty( $cached_response ) && ! $clear_cache ) {
			$data = $cached_response;
		} else {
			$data = static::get_embed_data_from_url( $url );
			static::set_cache( $cache_key, $data );
		}

		return $data;
	}

	/**
	 * Get data
	 *
	 * @param url $url URL.
	 * @return array.
	 */
	public static function get_embed_data_from_url( $url ) {

		$embed_data['url']          = $url;
		$parsed_url                 = static::parse_github_url( $url );
		$embed_data['extract_path'] = $parsed_url->extract_path;
		$embed_data['start_line']   = $parsed_url->start_line;
		$embed_data['end_line']     = $parsed_url->end_line;
		$embed_data['branch_short'] = $parsed_url->branch_short;
		$embed_data['code']         = static::get_github_code( $url );

		return $embed_data;
	}

	/**
	 * Fetch GitHub file content
	 *
	 * @param string $api_url GitHub API URL
	 * @return array
	 */
	public static function fetch_github_file_content( $api_url ) {
		$options = get_option( 'mone_options' );
		$token   = isset( $options['github_access_token'] ) ? $options['github_access_token'] : false;
		if ( $token !== false ) {
			$options = array(
				'http' => array(
					'header' => "User-Agent: PHP\r\n" .
								"Authorization: token $token\r\n",
				),
			);
		} else {
			$options = array(
				'http' => array(
					'header' => "User-Agent: PHP\r\n",
				),
			);
		}
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
	public static function parse_github_url( $url ) {
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
		$extract_path = $owner . '/' . $repo . '/' . $file_path;

		return (object) array(
			'extract_path' => $extract_path,
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
	public static function get_github_code( $url ) {
		$parsed_url = static::parse_github_url( $url );
		$api_url    = "https://api.github.com/repos/{$parsed_url->owner}/{$parsed_url->repo}/contents/{$parsed_url->file_path}?ref={$parsed_url->branch}";
		$data       = static::fetch_github_file_content( $api_url );

		if ( isset( $data['content'] ) ) {
			$file_content = base64_decode( $data['content'] );
			$lines        = explode( "\n", $file_content );
			return array_slice( $lines, $parsed_url->start_line - 1, $parsed_url->end_line - $parsed_url->start_line + 1 );
		}
		return false;
	}

	/**
	 * Utility function to build cache key for a given URL.
	 *
	 * @param string $url The URL for which to build a cache key.
	 * @return string The cache key.
	 */
	public static function build_cache_key_for_url( $url ) {
		return 'mone_github_url_details_response_' . md5( $url );
	}

	/**
	 * Utility function to retrieve a value from the cache at a given key.
	 *
	 * @param string $key The cache key.
	 * @return mixed The value from the cache.
	 */
	public static function get_cache( $key ) {
		return get_site_transient( $key );
	}

	/**
	 * Utility function to cache a given data set at a given cache key.
	 *
	 * @param string $key  The cache key under which to store the value.
	 * @param string $data The data to be stored at the given cache key.
	 * @return bool True when transient set. False if not set.
	 */
	public static function set_cache( $key, $data = '' ) {
		$ttl = DAY_IN_SECONDS;

		return set_site_transient( $key, $data, $ttl );
	}
}
Mone_Github_Embed::init();
