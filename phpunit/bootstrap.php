<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Gutenberg
 */

// Debug settings for parity with WordPress Core's PHPUnit tests.
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', true );
}
if ( ! defined( 'LOCAL_WP_DEBUG_LOG' ) ) {
	define( 'LOCAL_WP_DEBUG_LOG', true );
}
if ( ! defined( 'LOCAL_WP_DEBUG_DISPLAY' ) ) {
	define( 'LOCAL_WP_DEBUG_DISPLAY', true );
}
if ( ! defined( 'LOCAL_SCRIPT_DEBUG' ) ) {
	define( 'LOCAL_SCRIPT_DEBUG', true );
}
if ( ! defined( 'LOCAL_WP_ENVIRONMENT_TYPE' ) ) {
	define( 'LOCAL_WP_ENVIRONMENT_TYPE', 'local' );
}
define( 'MONE_DIR_TESTDATA', __DIR__ . '/data/' );

// Require composer dependencies.
require_once dirname( __DIR__ ) . '/vendor/autoload.php';

// If we're running in WP's build directory, ensure that WP knows that, too.
if ( 'build' === getenv( 'LOCAL_DIR' ) ) {
	define( 'WP_RUN_CORE_TESTS', true );
}

// Determine the tests directory (from a WP dev checkout).
// Try the WP_TESTS_DIR environment variable first.
$_tests_dir = getenv( 'WP_TESTS_DIR' );

// See if we're installed inside an existing WP dev instance.
if ( ! $_tests_dir ) {
	$_try_tests_dir = __DIR__ . '/../../../../../tests/phpunit';
	if ( file_exists( $_try_tests_dir . '/includes/functions.php' ) ) {
		$_tests_dir = $_try_tests_dir;
	}
}
// Fallback.
if ( ! $_tests_dir ) {
	$_tests_dir = '/tmp/wordpress-tests-lib';
}

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the theme being tested.
 */
function _manually_load_plugin() {
	register_theme_directory( __DIR__ . '/../../' );
	switch_theme( 'mone' );
}
tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

/**
 * Adds a wp_die handler for use during tests.
 *
 * If bootstrap.php triggers wp_die, it will not cause the script to fail. This
 * means that tests will look like they passed even though they should have
 * failed. So we throw an exception if WordPress dies during test setup. This
 * way the failure is observable.
 *
 * @param string|WP_Error $message The error message.
 *
 * @throws Exception When a `wp_die()` occurs.
 */
function fail_if_died( $message ) {
	if ( is_wp_error( $message ) ) {
		$message = $message->get_error_message();
	}

	throw new Exception( 'WordPress died: ' . $message );
}
tests_add_filter( 'wp_die_handler', 'fail_if_died' );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';

// Use existing behavior for wp_die during actual test execution.
remove_filter( 'wp_die_handler', 'fail_if_died' );
