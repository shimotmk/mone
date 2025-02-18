import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

export function createDialogBlock( id ) {
	return createBlock(
		'core/group',
		{
			anchor: id,
			tagName: 'dialog',
			metadata: {
				patternName: 'mone/dialog-group',
				name: __( 'Dialog', 'mone' ),
			},
			className: 'mone-dialog-content',
			style: {
				position: { type: 'fixed', top: '0px' },
				spacing: {
					padding: {
						right: '0',
						left: '0',
						top: '0',
						bottom: '0',
					},
				},
			},
			layout: { type: 'default' },
		},
		[
			createBlock(
				'core/group',
				{
					className: 'dialog_input_area',
					style: {
						spacing: {
							padding: {
								top: 'var:preset|spacing|10',
								bottom: 'var:preset|spacing|10',
								left: 'var:preset|spacing|10',
								right: 'var:preset|spacing|10',
							},
						},
					},
					layout: { type: 'default' },
					lock: {
						move: true,
						remove: true,
					},
					metadata: {
						patternName: 'mone/dialog-content',
						name: __( 'Dialog Content', 'mone' ),
					},
				},
				[
					createBlock( 'core/paragraph', {
						placeholder: __( 'Dialog contents is here!', 'mone' ),
					} ),
				]
			),
		]
	);
}
