/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

export function registerBlockTypeMegaMenuParts( settings, name ) {
	if ( name !== 'core/template-part' ) {
		return settings;
	}

	const updatedVariations = ( settings.variations || [] ).map( ( item ) =>
		item.attributes.area === 'menu' && item.scope.includes( 'inserter' )
			? {
					...item,
					scope: item.scope.filter(
						( scopeItem ) => scopeItem !== 'inserter'
					),
			  }
			: item
	);

	settings.variations = updatedVariations;

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/code',
	registerBlockTypeMegaMenuParts
);
