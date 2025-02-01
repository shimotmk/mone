<?php
/**
 * Class API Init Actions
 *
 * @package mone
 */

if ( class_exists( 'Mone_Github_Embed_Entry_Point' ) ) {
	return;
}

/**
 * Mone_Github_Embed_Entry_Point
 */
class Mone_Github_Embed_Entry_Point {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
	}

	/**
	 * Rest Api Init
	 *
	 * @return void
	 */
	public function rest_api_init() {
		register_rest_route(
			'mone/v1',
			'/github_embed_data',
			array(
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'post_embed_data' ),
					'permission_callback' => function () {
						return current_user_can( 'edit_posts' );
					},
				),
			)
		);
	}

	/**
	 *  Rest Update Callback
	 *
	 * @param object $request — .
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function post_embed_data( $request ) {
		$json_params = $request->get_json_params();
		$data        = Mone_Github_Embed::get_embed_data( $json_params['url'], $json_params['clearCache'] );
		return rest_ensure_response(
			array(
				'data'    => $data,
				'success' => true,
			)
		);
	}
}
