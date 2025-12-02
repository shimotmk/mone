/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockVariation } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { detail } from '../../icons';

registerBlockVariation( 'core/details', {
	name: 'mone/details-icon',
	title: __( 'Accordion', 'mone' ),
	category: 'mone-block-cat',
	icon: detail,
	attributes: {
		className: 'is-style-mone-details-icon mone-detail-icon-triangle',
		style: {
			border: {
				width: '1px',
				radius: 'var:preset|border-radius|10',
			},
		},
		borderColor: 'mone-border',
		moneSummaryOpenColor: 'heading-bg',
		metadata: {
			name: __( 'Accordion', 'mone' ),
		},
	},
	innerBlocks: [
		{
			name: 'core/group',
			attributes: {
				style: {
					spacing: {
						padding: {
							top: 'var:preset|spacing|10',
							bottom: 'var:preset|spacing|10',
							left: 'var:preset|spacing|10',
							right: 'var:preset|spacing|10',
						},
						margin: {
							top: '0',
						},
					},
				},
			},
			innerBlocks: [
				{
					name: 'core/paragraph',
					attributes: {
						placeholder: __( 'Accordion contents', 'mone' ),
					},
				},
			],
		},
	],
	scope: [ 'inserter' ],
} );
