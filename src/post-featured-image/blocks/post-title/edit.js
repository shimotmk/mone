/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

export const PostTitle = ( props ) => {
	const { postTitle, style } = props;

	return (
		<>
			<div
				style={ {
					...style,
					fontSize: 40,
					textOverflow: 'ellipsis',
					lineClamp: '1',
				} }
			>
				{ postTitle }
			</div>
		</>
	);
};

export default function Edit() {
	const blockProps = useBlockProps( {
		style: {
			display: 'flex',
		},
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Display' ) }>
					{ __( 'Settings', 'mone' ) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>{ __( 'Post Title', 'mone' ) }</div>
		</>
	);
}
