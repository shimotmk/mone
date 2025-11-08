/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';

export const Group = ( props ) => {
	const { style, children } = props;

	return (
		<>
			<div style={ style }>{ children }</div>
		</>
	);
};

export default function Edit() {
	const blockProps = useBlockProps( {
		style: {
			display: 'flex',
		},
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		renderAppender: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls></InspectorControls>
			<div { ...innerBlocksProps }>{ innerBlocksProps.children }</div>
		</>
	);
}
