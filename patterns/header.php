<?php
/**
 * Title: header
 * Slug: mone/header
 * Categories: header
 * Block Types: core/template-part/header
 *
 * @package mone
 */

?>
<!-- wp:group {"style":{"spacing":{"blockGap":"0"}},"backgroundColor":"content-bg","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-content-bg-background-color has-background"><!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"right":"var:preset|spacing|10","left":"var:preset|spacing|10"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide" style="padding-right:var(--wp--preset--spacing--10);padding-left:var(--wp--preset--spacing--10)"><!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|10"}}},"layout":{"type":"flex","justifyContent":"left","verticalAlignment":"center"}} -->
<div class="wp-block-group alignwide" style="padding-top:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--10)"><!-- wp:site-logo {"width":200} /-->

<!-- wp:paragraph {"className":"mone-sp-none","style":{"elements":{"link":{"color":{"text":"var:preset|color|content-contrast-2"}}},"typography":{"fontSize":"13px","lineHeight":"1"}},"textColor":"content-contrast-2"} -->
<p class="mone-sp-none has-content-contrast-2-color has-text-color has-link-color" style="font-size:13px;line-height:1"><?php esc_html_e( 'Written by Mone Creators', 'mone' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:navigation {"openSubmenusOnClick":true,"overlayMenu":"always","icon":"menu","overlayBackgroundColor":"key","overlayTextColor":"key-contrast","className":"is-style-mone-navigation mone-pc-none","style":{"typography":{"lineHeight":"1.5","textDecoration":"none"},"spacing":{"blockGap":"0.5rem"}},"layout":{"type":"flex"}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","className":"mone-sp-none","style":{"elements":{"link":{"color":{"text":"var:preset|color|key-contrast"}}},"spacing":{"padding":{"right":"var:preset|spacing|10","left":"var:preset|spacing|10"}}},"backgroundColor":"key","textColor":"key-contrast","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull mone-sp-none has-key-contrast-color has-key-background-color has-text-color has-background has-link-color" style="padding-right:var(--wp--preset--spacing--10);padding-left:var(--wp--preset--spacing--10)"><!-- wp:group {"align":"wide","layout":{"type":"flex"}} -->
<div class="wp-block-group alignwide"><!-- wp:navigation {"openSubmenusOnClick":true,"className":"is-style-mone-navigation","style":{"typography":{"lineHeight":"1.5","textDecoration":"none"},"spacing":{"blockGap":"0.5rem"}},"layout":{"type":"flex"}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->