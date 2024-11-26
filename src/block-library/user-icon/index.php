<?php
/**
 * Avatar
 *
 * @package mone
 */

namespace Mone_Theme\User_Icon;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Custom_user_profile_fields
 *
 * @param array $user user.
 */
function custom_user_profile_fields( $user ) {
	if ( ! current_user_can( 'edit_posts' ) ) {
		return;
	}

	wp_enqueue_media();
	?>
	<style type="text/css">
	.mone-form-image-preview-area { 
	margin-bottom: 12px;
	height: 100px;
	width: 100px;
	border: 1px dashed #c3c4c7;
	}
	.mone-image-preview { 
	display: block;
	width: 100px;
	max-height: 100px;
	object-fit: cover;
	}
	.mone-form-image-button-area { align-items: center;display: flex; }
	.mone-form-image-upload-button { margin-right: 12px!important; }
	</style>

	<script type="text/javascript">
		var file_frame;
		function moneShowMediaPicker(callback) {
			if (file_frame) {
				file_frame.off('select');
			} else { 
				file_frame = wp.media.frames.file_frame = wp.media({
					multiple: false,
			library: {
			type: 'image'
			}
				});
			}
			file_frame.on('select', function() {
				attachment = file_frame.state().get('selection').first().toJSON();
				callback(attachment);
			});
			file_frame.open();
		}

		document.addEventListener('DOMContentLoaded', function() {
			// 画像選択フィールドの選択ボタンクリックイベント
			document.querySelectorAll('.js-moneImageUploadButton').forEach(function(button) {
				button.addEventListener('click', function(event) {
					const fieldInputTagId = button.dataset.fieldId;
					const previewImageTagId = button.dataset.previewId;
					const size = button.dataset.size || 'full';

					// WordPressのメディアピッカーを表示
					moneShowMediaPicker(function(attachment) {
						let url = attachment.url;
						if (size in attachment.sizes) {
							url = attachment.sizes[size].url;
						}
						// 画像のURLをPostするための隠しフィールドをセット
						document.getElementById(fieldInputTagId).value = url;
						// 選択された画像をプレビューするimgタグをセット
						document.getElementById(previewImageTagId).src = url;
					});
				});
			});

			// 画像選択フィールドのクリアボタンクリックイベント
			document.querySelectorAll('.js-moneImageClearButton').forEach(function(button) {
				button.addEventListener('click', function(event) {
					const fieldInputTagId = button.dataset.fieldId;
					document.getElementById(fieldInputTagId).value = '';
					// 選択された画像をプレビューするimgタグをクリア
					const previewImageTagId = button.dataset.previewId;
					document.getElementById(previewImageTagId).src = '';
				});
			});
		});
	</script>
	<h3><?php _e( 'Mone Settings', 'mone' ); ?></h3>
	<table class="form-table">
			<tr>
					<th id="mone-icon-url"><label for="mone_icon_url"><?php _e( 'Icon URL', 'mone' ); ?></label></th>
					<td>
							<?php $field_name = 'mone_icon_url'; ?>
							<?php
							$option = get_user_meta( $user->ID, 'mone_icon_url', true );
							?>
							<div class="mone-form-image-preview-area">
									<img class="mone-image-preview"
												src="<?php echo $option; ?>"
												id="<?php echo "{$field_name}-preview"; ?>">
							</div>

							<input  
									type="hidden"
									value="<?php echo $option; ?>"
									name="<?php echo $field_name; ?>"
									id="<?php echo "{$field_name}-value"; ?>">

							<div class="mone-form-image-button-area">
									<input type="button"
												class="button mone-form-image-upload-button js-moneImageUploadButton"
												value=<?php _e( 'Select an image', 'mone' ); ?>
												data-field-id="<?php echo "{$field_name}-value"; ?>"
												data-preview-id="<?php echo "{$field_name}-preview"; ?>">
									<input type="button" 
													class="button js-moneImageClearButton" 
													value=<?php _e( 'delete', 'mone' ); ?>
													data-field-id="<?php echo "{$field_name}-value"; ?>"
													data-preview-id="<?php echo "{$field_name}-preview"; ?>">
							</div>
					</td>
			</tr>
	</table>
	<?php
}
add_action( 'show_user_profile', __NAMESPACE__ . '\custom_user_profile_fields' );
add_action( 'edit_user_profile', __NAMESPACE__ . '\custom_user_profile_fields' );

/**
 * Save_extra_user_profile_fields
 *
 * @param array $user_id user_id.
 */
function save_extra_user_profile_fields( $user_id ) {
	if ( ! current_user_can( 'edit_user', $user_id ) ) {
		return false;
	}
	update_user_meta( $user_id, 'mone_icon_url', $_POST['mone_icon_url'] );
}
add_action( 'personal_options_update', __NAMESPACE__ . '\save_extra_user_profile_fields' );
add_action( 'edit_user_profile_update', __NAMESPACE__ . '\save_extra_user_profile_fields' );

/**
 * Set_default_mone_icon_url
 *
 * @param array $user_id user_id.
 */
function set_default_mone_icon_url( $user_id ) {
	$default_icon_url = MONE_TEMPLATE_DIR_URL . '/assets/images/user-default.jpg';
	if ( '' === get_user_meta( $user_id, 'mone_icon_url', true ) ) {
		update_user_meta( $user_id, 'mone_icon_url', $default_icon_url );
	}
}
add_action( 'user_register', __NAMESPACE__ . '\set_default_mone_icon_url' );
add_action( 'profile_update', __NAMESPACE__ . '\set_default_mone_icon_url' );
