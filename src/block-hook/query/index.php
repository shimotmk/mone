<?php
/**
 * Query
 *
 * @package mone
 */

/**
 * Updates the query on the front end based on custom query attributes.
 */
add_filter(
	'pre_render_block',
	function ( $pre_render, $parsed_block, $parent_block ) {
		if ( 'core/query' !== $parsed_block['blockName'] ) {
			return $pre_render;
		}

		// mb-query-loopを使わなくなったら削除する.
		$name_space = $parsed_block['attrs']['namespace'] ?? '';
		if ( ! ( 'mb-query-loop' === $name_space || strpos( $name_space, 'mone-' ) === 0 ) ) {
			return $pre_render;
		}

		add_filter(
			'query_loop_block_query_vars',
			function ( $default_query, $block, $page ) {
				$block_query = $block->context['query'] ?? array();

				$filtered_query_args = array();

				if ( array_key_exists( 'meta_query', $block_query ) ) {
					$filtered_query_args = array_merge(
						$filtered_query_args,
						array(
							'meta_query' => mone_parse_meta_query( $block_query['meta_query'] ),
						)
					);
				}

				// 関連記事は現在のカテゴリーのみ & 現在の記事を除外する.
				$post_id = get_the_ID();
				if ( array_key_exists( 'moneQueryType', $block_query ) && 'related-query-loop' === $block_query['moneQueryType'] && false !== $post_id ) {
					$category_ids = array();
					$categories   = get_the_category( $post_id );
					if ( ! empty( $categories ) ) {
						foreach ( $categories as $category ) {
							$category_ids[] = $category->term_id;
						}
					}

					$filtered_query_args = array_merge(
						$filtered_query_args,
						array(
							'tax_query'    => array(
								array(
									'taxonomy'         => 'category',
									'terms'            => $category_ids,
									'include_children' => true,
								),
							),
							'post__not_in' => array( $post_id ),
						)
					);
				}

				if ( array_key_exists( 'include_posts', $block_query ) ) {
					$filtered_query_args = array_merge(
						$filtered_query_args,
						array(
							'post__in' => mone_get_include_ids( $block_query['include_posts'] ),
						)
					);
				}

				if ( array_key_exists( 'multiple_posts', $block_query ) ) {
					$filtered_query_args = array_merge(
						$filtered_query_args,
						array(
							'post_type' => mone_process_multiple_posts( $block_query['postType'], $block_query['multiple_posts'] ),
						)
					);
				}

				$return_array = array_merge(
					$default_query,
					$filtered_query_args
				);
				return $return_array;
			},
			10,
			3
		);
	},
	10,
	3
);


add_action(
	'init',
	function () {
		$registered_post_types = get_post_types( array( 'public' => true ) );
		foreach ( $registered_post_types as $registered_post_type ) {
			add_filter( 'rest_' . $registered_post_type . '_query', 'mone_add_custom_query_params', 10, 2 );
			add_filter( 'rest_' . $registered_post_type . '_collection_params', 'mone_add_more_sort_by', 10, 2 );
		}
	}
);

/**
 * Override the allowed items
 *
 * @see https://developer.wordpress.org/reference/classes/wp_rest_posts_controller/get_collection_params/
 *
 * @param array $query_params The query params.
 * @return array
 */
function mone_add_more_sort_by( $query_params ) {
	$query_params['orderby']['enum'][] = 'menu_order';
	$query_params['orderby']['enum'][] = 'meta_value';
	$query_params['orderby']['enum'][] = 'meta_value_num';
	$query_params['orderby']['enum'][] = 'rand';
	$query_params['orderby']['enum'][] = 'post__in';
	$query_params['orderby']['enum'][] = 'comment_count';
	$query_params['orderby']['enum'][] = 'name';
	return $query_params;
}

/**
 * Callback to handle the custom query params. Updates the block editor.
 *
 * @param array           $args    The query args.
 * @param WP_REST_Request $request The request object.
 */
function mone_add_custom_query_params( $args, $request ) {
	// Generate a new custom query will all potential query vars.
	$custom_args = array();

	// Meta related.
	$meta_query                = $request->get_param( 'meta_query' );
	$custom_args['meta_query'] = mone_parse_meta_query( $meta_query );

	// post__in.
	$include_posts           = $request->get_param( 'include_posts' );
	$custom_args['post__in'] = mone_get_include_ids( $include_posts );

	// multiple_posts.
	$multiple_post_types = $request->get_param( 'multiple_posts' );
	if ( $multiple_post_types ) {
		$custom_args['post_type'] = array_merge( array( $args['post_type'] ), $multiple_post_types );
	}

	// Merge all queries.
	return array_merge(
		$args,
		array_filter( $custom_args )
	);
}

/**
 * Callback to handle the custom query params. Updates the block editor.
 *
 * @param array $meta_query_data meta_query_data.
 * @return      $meta_queries
 */
function mone_parse_meta_query( $meta_query_data ) {
	$meta_queries = array();
	if ( isset( $meta_query_data ) ) {
		$meta_queries = array(
			'relation' => isset( $meta_query_data['relation'] ) ? $meta_query_data['relation'] : '',
		);

		if ( isset( $meta_query_data['queries'] ) ) {
			foreach ( $meta_query_data['queries'] as $query ) {
				$meta_queries[] = array_filter(
					array(
						'key'     => $query['meta_key'] ?? '',
						'value'   => $query['meta_value'],
						'compare' => $query['meta_compare'],
					)
				);
			}
		}
	}

	return array_filter( $meta_queries );
}

/**
 * Get the include posts.
 *
 * @param array $include_posts The include posts.
 * @return array
 */
function mone_get_include_ids( $include_posts ) {
	if ( is_array( $include_posts ) ) {
		return $include_posts;
	}
	return array();
}

/**
 * Process multiple posts.
 *
 * @param string $post_type The post type.
 * @param array  $multiple_posts The multiple posts.
 */
function mone_process_multiple_posts( $post_type, $multiple_posts ) {
	$custom_args = array_unique(
		array_merge(
			array(
				$post_type,
			),
			$multiple_posts
		),
		SORT_REGULAR
	);
	return $custom_args;
}
