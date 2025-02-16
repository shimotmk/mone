import { __ } from '@wordpress/i18n';

export const dialogTemplate = ( { id } ) => {
	return (
		'core/group',
		{
			anchor: id,
			tagName: 'dialog',
			lock: { move: false, remove: true },
			metadata: {
				patternName: 'mone/dialog-group',
				name: __( 'Dialog', 'mone' ),
			},
			className: 'mone-dialog-content mone-edit-show-dialog',
			style: {
				position: { type: 'fixed', top: '0px' },
				spacing: {
					padding: { right: '0', left: '0', top: '0', bottom: '0' },
				},
			},
			layout: { type: 'default' },
		},
		[
			( 'core/group',
			{
				lock: { move: true, remove: true },
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
				layout: { type: 'constrained' },
			},
			[
				( 'core/paragraph',
				{
					placeholder: __(
						'ダイアログコンテンツ デフォルト',
						'mone'
					),
				} ),
			] ),
		]
	);
};
