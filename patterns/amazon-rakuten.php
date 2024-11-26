<?php
/**
 * Title: Amazon Rakuten product card
 * Slug: mone/amazon-rakuten
 * Inserter: true
 * Categories: featured, mone-block-cat
 * Keywords: Amazon, Rakuten
 * Description: This block is ideal for showcasing products from Amazon and Rakuten.
 *
 * @package mone
 */

?>

<!-- wp:columns {"verticalAlignment":"center","className":"mone-amazon-rakuten-product","style":{"border":{"color":"#dddddd","width":"1px"},"spacing":{"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|10","left":"var:preset|spacing|10","right":"var:preset|spacing|10"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-columns are-vertically-aligned-center mone-amazon-rakuten-product has-border-color" style="border-color:#dddddd;border-width:1px;padding-top:var(--wp--preset--spacing--10);padding-right:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--10);padding-left:var(--wp--preset--spacing--10)"><!-- wp:column {"verticalAlignment":"center","width":"120px"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:120px"><!-- wp:image {"lightbox":{"enabled":false},"scale":"cover","sizeSlug":"large","linkDestination":"custom"} -->
<figure class="wp-block-image size-large"><a href="https://amazon.co.jp" target="_blank"><img alt="" style="object-fit:cover"/></a></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","layout":{"type":"constrained"}} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p><a href="https://amazon.co.jp" target="_blank" rel="noreferrer noopener"><?php esc_html_e( 'Product name', 'mone' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":{"left":"0.3em"}}}} -->
<div class="wp-block-buttons"><!-- wp:button {"style":{"color":{"background":"#e47911"},"border":{"radius":"0px"},"shadow":"none","typography":{"fontSize":"0.9rem"}}} -->
<div class="wp-block-button has-custom-font-size" style="font-size:0.9rem"><a class="wp-block-button__link has-background wp-element-button" href="https://www.amazon.co.jp" style="border-radius:0px;background-color:#e47911;box-shadow:none" target="_blank" rel="noreferrer noopener"><?php esc_html_e( 'View on Amazon', 'mone' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"style":{"color":{"background":"#565a5c"},"border":{"radius":"0px"},"shadow":"none","typography":{"fontSize":"0.9rem"}}} -->
<div class="wp-block-button has-custom-font-size" style="font-size:0.9rem"><a class="wp-block-button__link has-background wp-element-button" href="https://www.amazon.com/kindle-dbs/storefront" style="border-radius:0px;background-color:#565a5c;box-shadow:none" target="_blank" rel="noreferrer noopener"><?php esc_html_e( 'View on Kindle', 'mone' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"style":{"color":{"background":"#e00007"},"border":{"radius":"0px"},"shadow":"none","typography":{"fontSize":"0.9rem"}}} -->
<div class="wp-block-button has-custom-font-size" style="font-size:0.9rem"><a class="wp-block-button__link has-background wp-element-button" href="https://www.rakuten.co.jp" style="border-radius:0px;background-color:#e00007;box-shadow:none" target="_blank" rel="noreferrer noopener"><?php esc_html_e( 'View on Rakuten', 'mone' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->