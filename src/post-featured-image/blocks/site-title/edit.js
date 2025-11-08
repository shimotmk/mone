/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

export const SiteTitle = ( props ) => {
	const { siteTitle, style } = props;

	return (
		<>
			<div
				style={ {
					...style,
					fontSize: 40,
					display: 'block',
					textOverflow: 'ellipsis',
					lineClamp: '1',
				} }
			>
				{ siteTitle }
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
					{ __( 'Setting', 'mone' ) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>{ __( 'Site title', 'mone' ) }</div>
		</>
	);
}
