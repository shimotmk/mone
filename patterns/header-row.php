<?php
/**
 * Title: Header row
 * Slug: mone/header-row
 * Categories: header
 * Block Types: core/template-part/header
 *
 * @package mone
 */

?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|10","left":"var:preset|spacing|10","right":"var:preset|spacing|10"}}},"backgroundColor":"content-bg","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-content-bg-background-color has-background" style="padding-top:var(--wp--preset--spacing--10);padding-right:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--10);padding-left:var(--wp--preset--spacing--10)"><!-- wp:group {"align":"wide","style":{"position":{"type":""}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:site-logo {"width":300} /-->

<!-- wp:paragraph {"className":"mone-sp-none","style":{"elements":{"link":{"color":{"text":"var:preset|color|content-contrast-2"}}},"typography":{"fontSize":"13px"}},"textColor":"content-contrast-2"} -->
<p class="mone-sp-none has-content-contrast-2-color has-text-color has-link-color" style="font-size:13px"><?php esc_html_e( 'Written by Mone Creators', 'mone' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"position":{"type":""}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:navigation {"openSubmenusOnClick":true,"icon":"menu","align":"wide","className":"is-style-mone-navigation","style":{"spacing":{"blockGap":"0"}},"layout":{"type":"flex","flexWrap":"wrap"}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->