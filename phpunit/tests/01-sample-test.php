<?php
/**
 * Sample01Test class
 *
 * @package mone
 */

/**
 * Sample01Test.
 */
class Sample01Test extends WP_UnitTestCase {
	/**
	 * Test Block
	 *
	 * @return void
	 */
	public function test_phpunit() {

		print PHP_EOL;
		print '------------------------------------' . PHP_EOL;
		print 'Sample01Test' . PHP_EOL;
		print '------------------------------------' . PHP_EOL;
		$this->assertEquals( 1 + 1, 2 );
	}
}
