<?php
/**
 * Post_Featured_Image block rendering tests.
 *
 * @package WordPress
 * @subpackage Blocks
 */

/**
 * Tests for the Cover block.
 *
 * @group blocks
 */
class Tests_Blocks_Render_Post_Featured_Image extends WP_UnitTestCase {
	/**
	 * Post object.
	 *
	 * @var object
	 */
	protected static $post;

	/**
	 * Attachment id.
	 *
	 * @var int
	 */
	protected static $attachment_id;

	/**
	 * Block object.
	 *
	 * @var WP_Block
	 */
	protected static $block;

	/**
	 * Setup method.
	 */
	public static function wpSetUpBeforeClass() {
		self::$post  = self::factory()->post->create_and_get();
		self::$block = new stdClass();
	}

	/**
	 * Tear down method.
	 */
	public static function wpTearDownAfterClass() {
		wp_delete_post( self::$post->ID, true );
		wp_delete_post( self::$attachment_id, true );
	}

	/**
	 * Test gutenberg_render_block_core_post_featured_image() method.
	 *
	 * @covers ::gutenberg_render_block_core_post_featured_image
	 */
	public function test_gutenberg_render_block_core_post_featured_image() {
		$file                = DIR_TESTDATA . '/images/canola.jpg';
		self::$attachment_id = self::factory()->attachment->create_upload_object(
			$file,
			self::$post->ID,
			array(
				'post_mime_type' => 'image/jpeg',
			)
		);
		set_post_thumbnail( self::$post, self::$attachment_id );

		$GLOBALS['post']      = self::$post;
		$content              = '<!-- wp:post-featured-image {"style":{"color":{"duotone":"var:preset|duotone|grayscale"}}} /-->';
		self::$block->context = array( 'postId' => self::$post->ID );
		$parsed_blocks        = parse_blocks( $content );
		$block                = new WP_Block( $parsed_blocks[0], self::$block->context );
		$rendered             = $block->render();

		print PHP_EOL;
		print '------------------------------------' . PHP_EOL;
		print 'Tests_Image_Post_Featured_Image' . PHP_EOL;
		print '------------------------------------' . PHP_EOL;
		$this->assertStringContainsString( wp_get_attachment_image_url( self::$attachment_id, 'full' ), $rendered );
		$this->assertStringContainsString( 'wp-duotone-grayscale', $rendered );
	}

	/**
	 * Test post featured image with no image and default in query.
	 */
	public function test_post_featured_image_no_image_default_in_query() {

		$GLOBALS['post']      = self::$post;
		$content              = '<!-- wp:query {"queryId":1,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":null,"parents":[],"format":[]}} -->
<div class="wp-block-query"><!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:post-title /-->

<!-- wp:post-featured-image /-->

<!-- wp:post-date /-->
<!-- /wp:post-template --></div>
<!-- /wp:query -->';
		self::$block->context = array( 'postId' => self::$post->ID );
		$parsed_blocks        = parse_blocks( $content );
		$block                = new WP_Block( $parsed_blocks[0], self::$block->context );
		$rendered             = $block->render();

		$default_image_url = get_template_directory_uri() . '/assets/images/no-image.png';

		print PHP_EOL;
		print '------------------------------------' . PHP_EOL;
		print 'Tests_No_Image_In_Query_Default_Post_Featured_Image' . PHP_EOL;
		print '------------------------------------' . PHP_EOL;
		$this->assertStringContainsString( $default_image_url, $rendered );
	}
}
