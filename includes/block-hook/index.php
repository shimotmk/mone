<?php
/**
 * Register block hook
 *
 * @package mone
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register block hook
 */
function mone_register_block_hook() {
	$hook_blocks = array(
		'archives',
		'button',
		'code',
		'columns',
		'comments-pagination',
		'core-embed',
		'group',
		'heading',
		'list',
		'navigation-link',
		'post-content',
		'post-date',
		'post-featured-image',
		'post-template',
		'post-terms',
		'post-title',
		'preformatted',
		'query',
		'query-pagination',
		'query-pagination-next',
		'query-pagination-previous',
		'quote',
		'site-logo',
		'table',
		'template-part',
	);
	foreach ( $hook_blocks as $block ) {
		$block_file_path = MONE_TEMPLATE_DIR_PATH . '/build/block-hook/' . $block . '/index.php';
		if ( file_exists( $block_file_path ) ) {
			require_once $block_file_path;
		}

		$asset_file_path = MONE_TEMPLATE_DIR_PATH . '/build/block-hook/' . $block . '/index.asset.php';
		$asset_file      = file_exists( $asset_file_path ) ? include $asset_file_path : null;

		$style_url              = MONE_TEMPLATE_DIR_URL . '/build/block-hook/' . $block . '/style-index.css';
		$style_path             = MONE_TEMPLATE_DIR_PATH . '/build/block-hook/' . $block . '/style-index.css';
		$editor_style_url       = MONE_TEMPLATE_DIR_URL . '/build/block-hook/' . $block . '/index.css';
		$editor_style_path      = MONE_TEMPLATE_DIR_PATH . '/build/block-hook/' . $block . '/index.css';
		$editor_script_path     = MONE_TEMPLATE_DIR_PATH . '/build/block-hook/' . $block . '/index.js';
		$editor_script_url      = MONE_TEMPLATE_DIR_URL . '/build/block-hook/' . $block . '/index.js';
		$view_asset_file_path   = MONE_TEMPLATE_DIR_PATH . '/build/block-hook/' . $block . '/view.asset.php';
		$view_asset_file        = file_exists( $view_asset_file_path ) ? include $view_asset_file_path : null;
		$view_script_module_url = MONE_TEMPLATE_DIR_URL . '/build/block-hook/' . $block . '/view.js';

		// フロント両方で読み込む.
		add_action(
			'render_block',
			function ( $block_content, $parsed_block ) use ( $block, $style_path, $style_url, $asset_file ) {
				if ( 'core/' . $block === $parsed_block['blockName'] ) {
					if ( file_exists( $style_path ) && $asset_file ) {
						wp_enqueue_style(
							'mone-' . $block . '-style',
							$style_url,
							array(),
							$asset_file['version']
						);
					}
				}
				return $block_content;
			},
			10,
			2
		);

		// ブロックエディターで読み込む.
		add_action(
			'enqueue_block_assets',
			function () use ( $block, $style_path, $style_url, $editor_script_path, $editor_script_url, $asset_file, $editor_style_url, $editor_style_path ) {
				if ( is_admin() ) {
					if ( file_exists( $editor_script_path ) && $asset_file ) {
						wp_enqueue_script(
							'mone-' . $block . '-editor-script',
							$editor_script_url,
							$asset_file['dependencies'],
							$asset_file['version'],
							true
						);
						wp_set_script_translations(
							'mone-' . $block . '-editor-script',
							'mone',
							MONE_TEMPLATE_DIR_PATH . '/languages'
						);
					}
					if ( file_exists( $editor_style_path ) && $editor_style_url ) {
						wp_enqueue_style(
							'mone-' . $block . '-editor-style',
							$editor_style_url,
							array(),
							$asset_file['version']
						);
					}
					if ( file_exists( $style_path ) && $asset_file ) {
						wp_enqueue_style(
							'mone-' . $block . '-style',
							$style_url,
							array(),
							$asset_file['version']
						);
					}
				}
			}
		);

		// フロントで読み込む.
		add_action(
			'render_block',
			function ( $block_content, $parsed_block ) use ( $block, $view_script_module_url, $view_asset_file ) {
				if ( 'core/' . $block === $parsed_block['blockName'] ) {
					if ( $view_asset_file ) {
						wp_enqueue_script_module(
							'mone-' . $block . '-view-script-module',
							$view_script_module_url,
							$view_asset_file['dependencies'],
							$view_asset_file['version'],
							false
						);
					}
				}
				return $block_content;
			},
			10,
			2
		);
	}
}
mone_register_block_hook();
