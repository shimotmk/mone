<?php
/**
 * ClassNameTest class
 *
 * @package mone
 */

use function Mone_Theme\UtilsFunc\mone_string_to_array_class_name;
use function Mone_Theme\UtilsFunc\exists_class_name;

/**
 * ClassNameTest.
 */
class ClassNameTest extends WP_UnitTestCase {
	/**
	 * String_to_array_class_name
	 *
	 * @return void
	 */
	public function test_string_to_array_class_name() {
		$class_name  = 'foo bar';
		$array_class = mone_string_to_array_class_name( $class_name );
		$expect      = array(
			'foo',
			'bar',
		);
		$this->assertEquals( $array_class, $expect );
	}

	/**
	 * String_to_array_class_name
	 *
	 * @return void
	 */
	public function test_exists_class_name() {

		$class_name       = 'foo bar';
		$exists_class     = exists_class_name( 'foo', $class_name );
		$not_exists_class = exists_class_name( 'baz', $class_name );

		$this->assertTrue( $exists_class );
		$this->assertFalse( $not_exists_class );
	}
}
