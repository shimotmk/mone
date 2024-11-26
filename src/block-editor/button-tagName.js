import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { SelectControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';

export const withInspectorControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, setAttributes } = props;
		if ( name !== 'core/button' ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="advanced">
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'HTML element' ) }
						options={ [
							{ label: __( 'Default (<a>)' ), value: 'a' },
							{ label: '<button>', value: 'button' },
						] }
						value={ props.attributes.tagName || 'a' }
						onChange={ ( value ) => {
							setAttributes( { tagName: value } );
						} }
					/>
				</InspectorControls>
			</>
		);
	}
);
addFilter(
	'editor.BlockEdit',
	'mone/editor/button-tag-name/with-toolbar-controls',
	withInspectorControls
);
