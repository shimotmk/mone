/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

const ALLOWED_BLOCKS = [ 'mone/icon' ];

export default function Edit( props ) {
	const { attributes } = props;
	const { layout } = attributes;

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		templateInsertUpdatesSelection: true,
		orientation: layout?.orientation ?? 'horizontal',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }></PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps }>{ innerBlocksProps.children }</div>
		</>
	);
}
