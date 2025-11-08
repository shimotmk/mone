/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

export const PostAuthorName = ( props ) => {
	const { authorName, style } = props;

	return (
		<>
			<div
				style={ {
					...style,
					fontSize: 40,
					display: 'block',
					textOverflow: 'ellipsis',
					lineClamp: 1,
					marginLeft: '20px',
				} }
			>
				{ authorName }
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
			<div { ...blockProps }>{ __( 'Post author name', 'mone' ) }</div>
		</>
	);
}
