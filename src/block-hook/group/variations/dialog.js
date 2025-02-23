/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { dialogIcon as icon } from '../../../icons';

export const dialog = {
	name: 'mone/dialog-group',
	title: __( 'Dialog', 'mone' ),
	description: __( 'Dialog', 'mone' ),
	category: 'mone-block-cat',
	attributes: {
		metadata: {
			patternName: 'mone/dialog-group',
			name: __( 'Dialog', 'mone' ),
		},
	},
	icon,
	scope: [],
	isActive: ( blockAttributes ) =>
		blockAttributes?.metadata?.patternName === 'mone/dialog-group',
	innerBlocks: [],
};
