<?php
/**
 * Update
 *
 * @package mone
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

add_action(
	'admin_init',
	function () {
		add_filter(
			'puc_request_update_options_theme-mone',
			function ( $option ) {
				$option['sslverify'] = false;
				return $option;
			}
		);

		global $mone_update_checker;
		$base_url        = 'https://mone-wp.com/updates/?action=get_metadata&slug=mone';
		$options         = get_option( 'mone_activate_option' );
		$mone_user_email = isset( $options['mone_user_email'] ) ? urlencode( $options['mone_user_email'] ) : '';
		$url             = urlencode( mone_license_check_home_url() );
		$full_url        = $base_url . '&mone_user_email=' . $mone_user_email . '&home_url=' . $url;

		$mone_update_checker = PucFactory::buildUpdateChecker(
			$full_url,
			MONE_TEMPLATE_DIR_PATH . '/functions.php',
			'mone'
		);
	},
	999
);

/**
 * Get license url
 */
function mone_license_check_home_url() {
	return str_replace( array( 'http://', 'https://' ), '', home_url() );
}

/**
 * Admin notices
 */
function mone_license_admin_notices() {
	$check_result = mone_license_check();
	if ( 'valid' !== $check_result ) {
		?>
		<div class="notice notice-error settings-error">
			<p>
				<?php echo $check_result; ?>
			</p>
		</div>
		<?php
	}
}
add_action( 'all_admin_notices', 'mone_license_admin_notices' );

/**
 * License check
 */
function mone_license_check() {
	global $mone_update_checker;
	$options      = get_option( 'mone_activate_option' );
	$check_result = null;

	$mone_user_email = isset( $options['mone_user_email'] ) ? urlencode( $options['mone_user_email'] ) : '';

	$update = (array) $mone_update_checker->getUpdateState()->getUpdate();

	if ( empty( $mone_user_email ) ) {
		$check_result = sprintf(
			// translators: %s: Mone user authentication URL.
			__( '<a href="%s">Mone User Authentication</a>has not been completed. Version update functionality is limited.', 'mone' ),
			esc_url( admin_url() . 'themes.php?page=mone-activate' )
		);
	} elseif ( ! empty( $mone_user_email ) && ! empty( $update ) && empty( $update['download_url'] ) ) {
		$check_result = sprintf(
			// translators: %1$s: Mone user authentication URL, %2$s: My Page URL.
			__( '<a href="%1$s">Mone user authentication</a>has not been completed. If your email address and the authentication URL on your<a href="https://mone-wp.com/mypage/" target="_blank">My Page</a>are correct, an<a href="%2$1s">authentication check</a>please perform ', 'mone' ),
			esc_url( admin_url() . 'themes.php?page=mone-activate' ),
			esc_url( self_admin_url( 'update-core.php?force-check=1' ) )
		);
	} else {
		$check_result = 'valid';
	}

	return $check_result;
}
