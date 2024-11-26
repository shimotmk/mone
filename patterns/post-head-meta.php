<?php
/**
 * Title: Post Head Meta
 * Slug: mone/post-head-meta
 * Inserter: no
 * Keywords: post meta
 *
 * @package mone
 */

?>
<!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"0.5rem"},"elements":{"link":{"color":{"text":"var:preset|color|content-contrast-2"}}},"typography":{"fontSize":"0.8rem"}},"textColor":"content-contrast-2","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"center"}} -->
<div class="wp-block-group alignwide has-content-contrast-2-color has-text-color has-link-color" style="font-size:0.8rem"><!-- wp:post-date /-->

<!-- wp:post-date {"displayType":"modified","monePrefix":"(<?php esc_html_e( 'Last Updated', 'mone' ); ?>: ","moneSuffix":")"} /--></div>
<!-- /wp:group -->

<!-- wp:post-title {"textAlign":"center","level":1,"align":"wide","style":{"elements":{"link":{"color":{"text":"var:preset|color|content-contrast-2"}}}},"textColor":"content-contrast-2","fontSize":"large"} /-->
 
<!-- wp:post-terms {"term":"category","textAlign":"center","style":{"elements":{"link":{"color":{"text":"var:preset|color|mone-link"}}},"typography":{"fontStyle":"normal","fontWeight":"300"}},"textColor":"mone-link"} /-->