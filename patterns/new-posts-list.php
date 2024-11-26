<?php
/**
 * Title: Latest Articles
 * Slug: mone/new-posts-list
 * Categories: query, posts
 * Block Types: core/query
 *
 * @package mone
 */

?>
<!-- wp:query {"queryId": 64,"query":{"perPage":"4","pages":"0","offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false,"parents":[], "moneQueryType":"new-query-loop"},"enhancedPagination":true} -->
<div class="wp-block-query"><!-- wp:heading {"level":4,"style":{"border":{"left":{"color":"var:preset|color|key-2","width":"9px"}},"spacing":{"padding":{"right":"var:preset|spacing|10","left":"var:preset|spacing|10"}},"elements":{"link":{"color":{"text":"var:preset|color|key-2"}}},"typography":{"fontStyle":"normal","fontWeight":"500"}},"textColor":"key-2"} -->
<h4 class="wp-block-heading has-key-2-color has-text-color has-link-color" style="border-left-color:var(--wp--preset--color--key-2);border-left-width:9px;padding-right:var(--wp--preset--spacing--10);padding-left:var(--wp--preset--spacing--10);font-style:normal;font-weight:500"><?php esc_html_e( 'New Posts', 'mone' ); ?></h4>
<!-- /wp:heading -->

<!-- wp:post-template {"layout":{"type":"grid","columnCount":2}} -->
<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|10","right":"var:preset|spacing|10","bottom":"var:preset|spacing|10","left":"var:preset|spacing|10"}},"border":{"width":"1px"},"dimensions":{"minHeight":"100%"}},"borderColor":"mone-border","layout":{"type":"default"}} -->
<div class="wp-block-group alignwide has-border-color has-mone-border-border-color" style="border-width:1px;min-height:100%;padding-top:var(--wp--preset--spacing--10);padding-right:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--10);padding-left:var(--wp--preset--spacing--10)"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"1.91/1","style":{"border":{"width":"1px"},"borderColor":"mone-border","spacing":{"padding":{"top":"0","bottom":"0"}}},"borderColor":"mone-border"} /-->

<!-- wp:post-title {"textAlign":"center","level":5,"isLink":true} /--></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-pagination {"paginationArrow":"chevron","showLabel":false,"className":"is-style-mone-query-pagination","style":{"spacing":{"blockGap":"0.5rem"}},"layout":{"type":"flex","justifyContent":"center","orientation":"horizontal","flexWrap":"nowrap"}} -->
<!-- wp:query-pagination-previous /-->

<!-- wp:query-pagination-numbers {"className":"is-style-mone-query-pagination-numbers"} /-->

<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination --></div>

<!-- wp:query-no-results -->
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"align":"center","placeholder":"<?php esc_html_e( 'Please add text or a block to display when the query returns no results.', 'mone' ); ?>"} -->
<p class="has-text-align-center"><?php esc_html_e( 'No results found', 'mone' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
<!-- /wp:query-no-results -->

<!-- /wp:query -->