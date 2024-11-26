import { addFilter } from '@wordpress/hooks';

import './style.scss';
import { appreciateGroup, balloon } from './variations';
import './wrap-on-mobile';
// import { transforms } from './transforms';

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

	const hasAppreciateGroup = settings.variations.some(
		( variation ) => variation.name === appreciateGroup.name
	);

	if ( ! hasAppreciateGroup ) {
		settings.variations = [
			appreciateGroup,
			...( settings.variations || [] ),
		];
	}

	const hasBalloon = settings.variations.some(
		( variation ) => variation.name === balloon.name
	);

	if ( ! hasBalloon ) {
		settings.variations = [ balloon, ...( settings.variations || [] ) ];
	}

	// settings.transforms = transforms;

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/group',
	registerBlockTypeGroup
);
