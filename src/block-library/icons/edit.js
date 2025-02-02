/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [ 'mone/icon' ];

const DEFAULT_BLOCK = {
	name: 'mone/icon',
	attributesToCopy: [
		'iconSVG',
		'iconName',
		'iconColor',
		'iconGradient',
		'iconCustomGradient',
		'width',
		'height',
		'url',
		'linkTarget',
		'rel',
		'hoverBackgroundColor',
		// core
		'backgroundColor',
		'border',
		'className',
		'gradient',
		'style',
	],
};

export default function Edit( props ) {
	const { attributes } = props;
	const { layout } = attributes;

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		defaultBlock: DEFAULT_BLOCK,
		directInsert: true,
		template: [ ALLOWED_BLOCKS ],
		allowedBlocks: ALLOWED_BLOCKS,
		templateInsertUpdatesSelection: true,
		orientation: layout?.orientation ?? 'horizontal',
	} );

	return (
		<>
			<div { ...innerBlocksProps }>{ innerBlocksProps.children }</div>
		</>
	);
}
