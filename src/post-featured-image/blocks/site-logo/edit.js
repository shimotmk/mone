/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

export const SiteLogo = ( props ) => {
	const { siteLogoUrl, style } = props;

	return (
		<>
			{ siteLogoUrl !== false ? (
				<div style={ style }>
					{ /* eslint-disable-next-line jsx-a11y/alt-text */ }
					<img
						style={ {
							height: '100%',
							maxWidth: '100%',
						} }
						src={ siteLogoUrl }
					/>
				</div>
			) : (
				<div
					style={ {
						display: 'flex',
					} }
				>
					{ __( 'Logo not found', 'mone' ) }
				</div>
			) }
		</>
	);
};

export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Display' ) }>
					{ __( 'Setting', 'mone' ) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }></div>
		</>
	);
}
