/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [ 'mone/icon' ];

export default function Edit( props ) {
	const { attributes } = props;
	const { layout } = attributes;

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
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
