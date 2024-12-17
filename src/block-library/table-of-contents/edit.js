import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

export default function TableOfContentEdit( props ) {
	const { attributes, setAttributes } = props;
	const { label } = attributes;

	const blockProps = useBlockProps( {
		className: clsx( 'mone-mega-menu' ),
	} );

	return (
		<>
			<InspectorControls></InspectorControls>
			<div { ...blockProps }>目次ブロック</div>
		</>
	);
}
