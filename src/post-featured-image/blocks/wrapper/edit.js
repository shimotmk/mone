/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [
	'mone/satori-group',
	'mone/satori-post-author-icon',
	'mone/satori-post-author-name',
	'mone/satori-post-title',
	'mone/satori-site-logo',
	'mone/satori-site-title',
];

export const Wrapper = ( props ) => {
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
		allowedBlocks: ALLOWED_BLOCKS,
		renderAppender: InnerBlocks.ButtonBlockAppender,
		__experimentalCaptureToolbars: true,
		__unstableDisableLayoutClassNames: true,
	} );

	return (
		<>
			<InspectorControls></InspectorControls>
			<div { ...innerBlocksProps }>{ innerBlocksProps.children }</div>
		</>
	);
}
