<?php
/**
 * Mega Menu
 *
 * @package mone
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$label          = $attributes['label'] ?? '';
$menu_slug      = esc_attr( $attributes['menuSlug'] ?? '' );
$url            = $attributes['url'] ?? '';
$link_target    = $attributes['linkTarget'] ?? '';
$rel            = $attributes['rel'] ?? '';
$title          = $attributes['title'] ?? '';
$mega_menu_type = $attributes['megaMenuType'] ?? 'click';


if ( ! $label ) {
	return null;
}

$allowed_html = array(
	'span' => array(
		'aria-hidden' => true,
		'style'       => array(),
		'class'       => array(),
	),
);

if ( ! empty( $url ) && 'click' !== $mega_menu_type ) {
	$markup_label = sprintf(
		'<a class="wp-block-navigation-item__content" href="%1$s" target="%2$s" rel="%3$s" title="%4$s">%5$s</a>',
		esc_url( $url ),
		esc_attr( $link_target ),
		esc_attr( $rel ),
		esc_attr( $title ),
		wp_kses( $label, $allowed_html )
	);
} else {
	$markup_label = wp_kses( $label, $allowed_html );
}

?>
<li 
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="mone/mega-menu"
	data-wp-context='{ "isMenuOpen": false, "offsetLeft": "", "clientWidth": "", "submenuOpenedBy": { "click": false, "hover": false, "focus": false } }'
	data-wp-init="callbacks.setMegaMenuStyles"
	data-wp-on--load="callbacks.setMegaMenuStyles"
	data-wp-on-window--resize="callbacks.setMegaMenuStyles"
	data-wp-watch="callbacks.setMegaMenuStyles"
	data-wp-style----mone--window-offset-Left="context.offsetLeft"
	data-wp-style----mone--window-client-Width="context.clientWidth"
>
	<button
		<?php
		if ( 'click' === $mega_menu_type ) {
			echo 'data-wp-on--click="actions.toggleMenu"';
		} else {
			echo 'data-wp-on--mouseenter="actions.openMenuOnHover"';
			echo 'data-wp-on--mouseleave="actions.closeMenuOnHover"';
		}
		?>
		data-wp-bind--aria-expanded="context.isMenuOpen"
		class="wp-block-navigation-item__content"
	>
		<?php echo $markup_label; ?>
	</button>
	<div 
		class="wp-block-create-block-mega-menu-block__menu-container"
		data-wp-class--is-menu-open="context.isMenuOpen"
		<?php
		if ( 'click' !== $mega_menu_type ) {
			echo 'data-wp-on--mouseenter="actions.openMenuOnHover"';
			echo 'data-wp-on--mouseleave="actions.closeMenuOnHover"';
		}
		?>
	>
		<?php echo block_template_part( $menu_slug ); ?>
	</div>
</li>
