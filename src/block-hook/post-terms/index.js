import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
/* global moneGroupData */

export function registerBlockTypePostTerms( settings, name ) {
	if ( name !== 'core/post-terms' ) {
		return settings;
	}

	const addAttributes = {
		prefix: `<img width="18" height="18" class="wp-image-tags-solid" style="width: 18px;" src="${
			moneGroupData.templateUri
		}/assets/images/tags-solid.png" alt="${ __( 'Tags', 'mone' ) }"> `,
		style: {
			elements: {
				link: {
					color: {
						text: 'var:preset|color|content-contrast-3',
					},
				},
			},
			textColor: 'content-contrast-3',
			typography: {
				fontStyle: 'normal',
				fontWeight: '700',
			},
		},
	};

	if ( ! settings.variations ) {
		settings.variations = [];
	}

	const updatedVariations = settings.variations.map( ( variation ) => {
		if ( variation.name === 'post_tag' ) {
			return {
				...variation,
				attributes: {
					...variation.attributes,
					...addAttributes,
				},
			};
		}
		return variation;
	} );

	settings.variations = updatedVariations;

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/post-terms',
	registerBlockTypePostTerms
);
