<?php
/**
 * Group
 *
 * @package mone
 */

namespace Mone_Theme\Group;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once MONE_TEMPLATE_DIR_PATH . '/build/block-hook/group/sns-share.php';

/**
 * Group
 *
 * @package mone
 */
function enqueue_block_editor_group() {
	$data_to_pass = array(
		'templateUri' => MONE_TEMPLATE_DIR_URL,
	);
	wp_localize_script( 'mone-group-editor-script', 'moneGroupData', $data_to_pass );
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_editor_group', 11 );

/**
 * Mone_add_applause_settings.
 *
 * @param string $settings settings.
 * @param array  $metadata metadata.
 * @return string
 */
function add_applause_settings( $settings, $metadata ) {
	if ( 'core/group' !== $metadata['name'] ) {
		return $settings;
	}

	$attributes = array();
	if ( ! empty( $settings['attributes'] ) ) {
		$attributes = $settings['attributes'];
	}
	$add_attributes = array(
		'moneIsApplause' => array(
			'type' => 'boolean',
		),
	);

	$settings['attributes'] = array_merge(
		$attributes,
		$add_attributes
	);

	$settings['uses_context'] = array(
		'postId',
		'postType',
	);

	return $settings;
}
add_filter( 'block_type_metadata_settings', __NAMESPACE__ . '\add_applause_settings', 10, 2 );

/**
 * Register the block
 *
 * @return void
 */
function appreciate_count_register_meta() {
	register_meta(
		'post',
		'mone_appreciate_count',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\appreciate_count_register_meta' );

/**
 * Render_post_button
 *
 * @param string $block_content block_content.
 * @param array  $parsed_block parsed_block.
 * @param object $block block.
 */
function render_block_appreciate_group( $block_content, $parsed_block, $block ) {
	if ( ! isset( $block->context['postId'] ) ) {
		return $block_content;
	}

	if ( ! isset( $parsed_block['attrs']['moneIsApplause'] ) ) {
		return $block_content;
	}

	$initial_count = get_post_meta( $block->context['postId'], 'mone_appreciate_count', true );
	if ( ! $initial_count ) {
		$initial_count = 0;
	}

	wp_interactivity_state(
		'mone/click-applause-button',
		array(
			$block->context['postId'] => array(
				'count' => $initial_count,
			),
		)
	);

	$p = new \WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag() ) {

		$p->set_attribute( 'data-wp-interactive', 'mone/click-applause-button' );
		$p->set_attribute( 'data-wp-context', '{ "postId": ' . $block->context['postId'] . ', "isClicked": false, "showCount": false }' );
	}

	if ( $p->next_tag( 'button' ) ) {
		$p->set_attribute( 'data-wp-on--click', 'actions.clickApplause' );
		$p->set_attribute( 'data-wp-class--is-clicked', 'context.isClicked' );
		$p->add_class( 'mone-applause-button' );
	}

	if ( $p->next_tag(
		array(
			'tag_name'   => 'p',
			'class_name' => 'mone_appreciate_count',
		)
	) ) {
		$p->set_attribute( 'data-wp-text', 'state.count' );
		$p->set_attribute( 'data-wp-class--is-show-count', 'context.showCount' );
	}

	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/group', __NAMESPACE__ . '\render_block_appreciate_group', 10, 3 );

/**
 * REST API
 */
function appreciate_rest_api_init() {
	register_rest_route(
		'mone-user-meta/v1',
		'appreciate',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => __NAMESPACE__ . '\get_appreciate_rest_api_callback',
				'permission_callback' => '__return_true',
			),
			array(
				'methods'             => 'POST',
				'callback'            => __NAMESPACE__ . '\post_appreciate_rest_api_callback',
				'permission_callback' => '__return_true',
			),
		)
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\appreciate_rest_api_init' );

/**
 * REST API callback
 *
 * @param WP_REST_Request $request request.
 *
 * @return WP_REST_Response response.
 */
function get_appreciate_rest_api_callback( $request ) {
	$post_id       = $request['postId'];
	$mone_icon_url = get_post_meta( $post_id, 'mone_appreciate_count', true );
	return rest_ensure_response( $mone_icon_url );
}

/**
 * REST API callback
 *
 * @param WP_REST_Request $request request.
 *
 * @return WP_REST_Response response.
 */
function post_appreciate_rest_api_callback( $request ) {
	$json_params = $request->get_json_params();
	$post_id     = $json_params['postId'];
	update_post_meta( $post_id, 'mone_appreciate_count', $json_params['count'] );
	return rest_ensure_response(
		array(
			'success' => true,
		)
	);
}
