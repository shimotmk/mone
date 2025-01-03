import { addFilter } from '@wordpress/hooks';

import './style.scss';
import { appreciateGroup, balloon, boxMenu } from './variations';
import './wrap-on-mobile';
import './link';

export function registerBlockTypeGroup( settings, name ) {
	if ( name !== 'core/group' ) {
		return settings;
	}

	settings.supports = {
		...settings.supports,
		shadow: true,
	};

	settings.attributes = {
		...settings.attributes,
		moneIsApplause: {
			type: 'boolean',
		},
	};

	const variationsToAdd = [ appreciateGroup, balloon, boxMenu ];
	variationsToAdd.forEach( ( variation ) => {
		const hasVariation = settings.variations.some(
			( existingVariation ) => existingVariation.name === variation.name
		);

		if ( ! hasVariation ) {
			settings.variations = [
				variation,
				...( settings.variations || [] ),
			];
		}
	} );

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/group',
	registerBlockTypeGroup
);
