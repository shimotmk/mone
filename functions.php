<?php
/**
 * Mone
 *
 * @package mone
 */

namespace Mone_Theme;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'MONE_TEMPLATE_DIR_PATH', get_template_directory( __FILE__ ) );
define( 'MONE_TEMPLATE_DIR_URL', get_template_directory_uri( __FILE__ ) );
define( 'MONE_VERSION', wp_get_theme()->get( 'Version' ) );

require 'vendor/autoload.php';

require_once __DIR__ . '/build/admin/index.php';
require_once __DIR__ . '/build/block-editor/custom-css/index.php';
require_once __DIR__ . '/build/block-editor/hidden/index.php';
require_once __DIR__ . '/build/block-editor/position/index.php';
require_once __DIR__ . '/build/block-editor/index.php';
require_once __DIR__ . '/build/post-featured-image/index.php';
require_once __DIR__ . '/includes/block-editor/index.php';
require_once __DIR__ . '/includes/block-hook/index.php';
require_once __DIR__ . '/includes/block-library/index.php';
require_once __DIR__ . '/includes/gutenberg/copyright-binding.php';
require_once __DIR__ . '/includes/gutenberg/translate.php';
require_once __DIR__ . '/includes/block-patterns.php';
require_once __DIR__ . '/includes/json-ld.php';
require_once __DIR__ . '/includes/set-up-theme/index.php';
require_once __DIR__ . '/includes/update/index.php';
require_once __DIR__ . '/build/components/index.php';
require_once __DIR__ . '/build/edit-post/index.php';
require_once __DIR__ . '/build/format-library/index.php';
require_once __DIR__ . '/build/utils/index.php';
require_once __DIR__ . '/build/plugins/index.php';
require_once __DIR__ . '/build/preferences/index.php';
require_once __DIR__ . '/build/preferences/user/index.php';
require_once __DIR__ . '/build/utils-func/class-name/index.php';
require_once __DIR__ . '/build/utils-func/is-hex-color/index.php';
require_once __DIR__ . '/build/utils-func/process_spacing/index.php';
