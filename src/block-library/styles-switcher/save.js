/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	return (
		<div { ...useBlockProps.save() }>
			<div className="mone-styles-switcher-title"></div>
			<ul>
				<InnerBlocks.Content />
			</ul>
		</div>
	);
}
