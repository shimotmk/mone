<?php
/**
 * Title: List of posts, 1 column
 * Slug: mone/template-query-loop
 * Categories: query
 * Block Types: core/query
 * Description: A list of posts, 1 column, with featured image and post date.
 *
 * @package mone
 */

?>
<!-- wp:query {"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true},"enhancedPagination":true,"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-query alignwide"><!-- wp:post-template {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"default"}} -->
<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"backgroundColor":"content-bg","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide has-content-bg-background-color has-background" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)">
<!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"0.5rem"},"elements":{"link":{"color":{"text":"var:preset|color|content-contrast-2"}}},"typography":{"fontSize":"0.8rem"}},"textColor":"content-contrast-2","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"center"}} -->
<div class="wp-block-group alignwide has-content-contrast-2-color has-text-color has-link-color" style="font-size:0.8rem"><!-- wp:post-date /-->

<!-- wp:post-date {"displayType":"modified","monePrefix":"(<?php esc_html_e( 'Last Updated', 'mone' ); ?>: ","moneSuffix":")"} /--></div>
<!-- /wp:group -->

<!-- wp:post-title {"textAlign":"center","isLink":true,"align":"wide","style":{"color":{"background":"#ffffff00"},"elements":{"link":{"color":{"text":"var:preset|color|content-contrast-2"}}},"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"textColor":"contrast-2","fontSize":"large"} /-->

<!-- wp:post-terms {"term":"category","textAlign":"center","style":{"elements":{"link":{"color":{"text":"var:preset|color|mone-link"}}},"typography":{"fontStyle":"normal","fontWeight":"300"}},"textColor":"mone-link"} /-->

<!-- wp:post-featured-image {"isLink":true,"align":"wide","style":{"border":{"width":"1px"}},"borderColor":"mone-border"} /-->

<!-- wp:post-excerpt {"textAlign":"center","excerptLength":100,"style":{"elements":{"link":{"color":{"text":"var:preset|color|content-contrast-2"}}}},"textColor":"content-contrast-2"} /-->

<!-- wp:read-more {"content":"Read more","style":{"spacing":{"padding":{"left":"1em","right":"1em","top":"1rem","bottom":"1rem"}},"border":{"color":"#909090","width":"1px"},"elements":{"link":{"color":{"text":"var:preset|color|content-contrast-2"}}}},"textColor":"content-contrast-2"} /-->

</div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-no-results {"align":"wide","backgroundColor":"content-bg"} -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)"><!-- wp:paragraph {"align":"center","placeholder":"<?php esc_html_e( 'Please add text or a block to display when the query returns no results.', 'mone' ); ?>"} -->
<p class="has-text-align-center"><?php esc_html_e( 'No results found', 'mone' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
<!-- /wp:query-no-results -->

<!-- wp:query-pagination {"paginationArrow":"chevron","align":"wide","layout":{"type":"flex","justifyContent":"space-between"}} -->
<!-- wp:query-pagination-previous {"label":"<?php esc_html_e( 'Previous Post', 'mone' ); ?>","style":{"border":{"width":"1px"},"spacing":{"padding":{"right":"var:preset|spacing|10","left":"var:preset|spacing|10","top":"0.75rem","bottom":"0.75rem"}},"elements":{"link":{"color":{"text":"var:preset|color|content-contrast-2"}}}},"textColor":"content-contrast-2","fontSize":"small","borderColor":"mone-border"} /-->

<!-- wp:query-pagination-next {"label":"<?php esc_html_e( 'Next Post', 'mone' ); ?>","style":{"border":{"width":"1px"},"spacing":{"padding":{"right":"var:preset|spacing|10","left":"var:preset|spacing|10","top":"0.75rem","bottom":"0.75rem"}},"elements":{"link":{"color":{"text":"var:preset|color|content-contrast-2"}}}},"textColor":"content-contrast-2","fontSize":"small","borderColor":"mone-border"} /-->
<!-- /wp:query-pagination --></div>
<!-- /wp:query -->