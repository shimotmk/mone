<?php
/**
 * Title: sidebar
 * Slug: mone/sidebar
 * Inserter: no
 *
 * @package mone
 */

?>
<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|10"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"padding":{"right":"var:preset|spacing|10","left":"var:preset|spacing|10","top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}}},"backgroundColor":"content-bg","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-content-bg-background-color has-background" style="padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--10)"><!-- wp:image {"lightbox":{"enabled":false},"width":"130px","sizeSlug":"full","linkDestination":"none","align":"center","style":{"border":{"radius":"100px"},"color":[]}} -->
<figure class="wp-block-image aligncenter size-full is-resized has-custom-border"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/user-default.jpg" alt="<?php esc_attr_e( 'Mone Creators', 'mone' ); ?>" style="border-radius:100px;width:130px"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"textAlign":"center","level":4,"style":{"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontSize":"medium"} -->
<h4 class="wp-block-heading has-text-align-center has-medium-font-size" style="font-style:normal;font-weight:500"><?php esc_html_e( 'Mone Creators', 'mone' ); ?></h4>
<!-- /wp:heading -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"center"}} -->
<div class="wp-block-group"><!-- wp:separator {"style":{"layout":{"selfStretch":"fixed","flexSize":"20%"}},"backgroundColor":"key-2"} -->
<hr class="wp-block-separator has-text-color has-key-2-color has-alpha-channel-opacity has-key-2-background-color has-background"/>
<!-- /wp:separator --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><?php esc_html_e( 'Profile text Profile text Profile text Profile text Profile text Profile text Profile text Profile text Profile text Profile text Profile text Profile text Profile text Profile text Profile text Profile text', 'mone' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"right":"var:preset|spacing|10","left":"var:preset|spacing|10","top":"var:preset|spacing|10","bottom":"var:preset|spacing|10"}}},"backgroundColor":"content-bg","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-content-bg-background-color has-background" style="padding-top:var(--wp--preset--spacing--10);padding-right:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--10);padding-left:var(--wp--preset--spacing--10)"><!-- wp:search {"label":"Search","showLabel":false,"placeholder":"Search for...","buttonText":"Search","buttonPosition":"button-inside","buttonUseIcon":true,"style":{"border":{"width":"1px"}},"fontSize":"small","borderColor":"mone-border"} /--></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"right":"var:preset|spacing|10","left":"var:preset|spacing|10","top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}}},"backgroundColor":"content-bg","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-content-bg-background-color has-background" style="padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--10)"><!-- wp:query {"queryId":62,"query":{"perPage":"5","pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"meta_value_num","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false,"meta_query":{"queries":[{"id":"d70b11bb-f127-4fbe-be35-7e0849a2b7f0","meta_key":"mone_post_views_count","meta_value":"","meta_compare":""}]}},"namespace":"mone-popular-query-loop","enhancedPagination":true} -->
<div class="wp-block-query"><!-- wp:heading {"textAlign":"center","level":4,"style":{"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontSize":"medium"} -->
<h4 class="wp-block-heading has-text-align-center has-medium-font-size" style="font-style:normal;font-weight:500"><?php esc_html_e( 'Most Read Articles', 'mone' ); ?></h4>
<!-- /wp:heading -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"center"}} -->
<div class="wp-block-group"><!-- wp:separator {"style":{"layout":{"selfStretch":"fixed","flexSize":"20%"}},"backgroundColor":"key-2"} -->
<hr class="wp-block-separator has-text-color has-key-2-color has-alpha-channel-opacity has-key-2-background-color has-background"/>
<!-- /wp:separator --></div>
<!-- /wp:group -->

<!-- wp:post-template -->
<!-- wp:post-featured-image {"isLink":true,"style":{"border":{"width":"1px"}},"borderColor":"mone-border"} /-->

<!-- wp:post-title {"textAlign":"center","level":5,"isLink":true} /-->
<!-- /wp:post-template --></div>

<!-- wp:query-no-results -->
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"align":"center","placeholder":"<?php esc_html_e( 'Please add text or a block to display when the query returns no results.', 'mone' ); ?>"} -->
<p class="has-text-align-center"><?php esc_html_e( 'No results found', 'mone' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
<!-- /wp:query-no-results -->

<!-- /wp:query --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|10","right":"var:preset|spacing|10"}}},"backgroundColor":"content-bg","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-content-bg-background-color has-background" style="padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--10)"><!-- wp:heading {"textAlign":"center","level":4,"style":{"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontSize":"medium"} -->
<h4 class="wp-block-heading has-text-align-center has-medium-font-size" style="font-style:normal;font-weight:500"><?php esc_html_e( 'Archive', 'mone' ); ?></h4>
<!-- /wp:heading -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"center"}} -->
<div class="wp-block-group"><!-- wp:separator {"style":{"layout":{"selfStretch":"fixed","flexSize":"20%"}},"backgroundColor":"key-2"} -->
<hr class="wp-block-separator has-text-color has-key-2-color has-alpha-channel-opacity has-key-2-background-color has-background"/>
<!-- /wp:separator --></div>
<!-- /wp:group -->

<!-- wp:archives {"className":"is-style-mone-archives-list-unstyled"} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->