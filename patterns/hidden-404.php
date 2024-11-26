<?php
/**
 * Title: Hidden 404
 * Slug: mone/hidden-404
 * Inserter: true
 * Categories: mone/404
 * Keywords: 404, not found
 * Description: 404 page template
 *
 * @package mone
 */

?>
<!-- wp:group {"tagName":"article","layout":{"type":"constrained"}} -->
<article class="wp-block-group"><!-- wp:group {"tagName":"section","className":"alignwide","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}}},"backgroundColor":"content-bg","layout":{"type":"constrained","contentSize":"800px"}} -->
<section class="wp-block-group alignwide has-content-bg-background-color has-background" style="padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading"><?php esc_html_e( '404', 'mone' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:group {"style":{"spacing":{"margin":{"top":"5px"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group" style="margin-top:5px"><!-- wp:paragraph -->
<p><?php esc_html_e( 'This page could not be found.', 'mone' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:search {"label":"Search","showLabel":false,"placeholder":"Search for...","buttonText":"Search","buttonPosition":"button-inside","buttonUseIcon":true,"style":{"border":{"width":"1px"}},"fontSize":"small","borderColor":"mone-border"} /--></div>
<!-- /wp:group --></section>
<!-- /wp:group --></article>
<!-- /wp:group -->
