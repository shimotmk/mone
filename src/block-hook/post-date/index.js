import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { PanelBody, TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';

export function registerBlockTypePostDate( settings, name ) {
	if ( name !== 'core/post-date' ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		monePrefix: {
			type: 'string',
		},
		moneSuffix: {
			type: 'string',
		},
	};

	return settings;
}

export const blockEditPostDate = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		if ( name !== 'core/post-date' ) {
			return <BlockEdit { ...props } />;
		}
		const { monePrefix, moneSuffix } = attributes;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Mone prefix suffix', 'mone' ) }
						initialOpen={ true }
					>
						<TextControl
							label={ __( 'Prefix' ) }
							value={ monePrefix || '' }
							onChange={ ( value ) =>
								setAttributes( { monePrefix: value } )
							}
							placeholder={ __( 'Prefix' ) }
						/>
						<TextControl
							label={ __( 'Suffix' ) }
							value={ moneSuffix || '' }
							onChange={ ( value ) =>
								setAttributes( { moneSuffix: value } )
							}
							placeholder={ __( 'Suffix' ) }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	}
);

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/post-date',
	registerBlockTypePostDate
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/post-date',
	blockEditPostDate
);
