import { addFilter } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';

import './menu-controls';
import './layout';
import './color-settings';
import './background-image';
import './padding';
import './border';

export function registerBlockTypeMone( settings, name ) {
	const hasSupportMone = hasBlockSupport( name, 'mone', true );

	if ( ! hasSupportMone ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		moneStyle: {
			type: 'object',
		},
	};

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/mone-post-featured-image',
	registerBlockTypeMone
);
