import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

export function createDialogBlock( id, name ) {
	return createBlock(
		'core/group',
		{
			anchor: id,
			tagName: 'dialog',
			metadata: {
				patternName: 'mone/dialog-group',
				name: name + ' ' + __( 'Dialog', 'mone' ),
			},
			className: 'mone-dialog-container',
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
					className: 'mone-dialog-container-content',
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
					createBlock(
						'core/group',
						{
							metadata: {
								name: __( 'Dialog close', 'mone' ),
							},
							style: {
								position: {
									type: 'sticky',
									top: '1.25rem',
									right: '0px',
								},
							},
							layout: {
								type: 'constrained',
							},
						},
						[
							createBlock(
								'mone/icons',
								{
									align: 'full',
									className: 'dialog-close-button',
									layout: {
										type: 'flex',
										justifyContent: 'right',
									},
								},
								[
									createBlock( 'mone/icon', {
										width: '1.25rem',
										height: '1.25rem',
										tagName: 'button',
										iconSVG:
											'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>',
									} ),
								]
							),
						]
					),
					createBlock( 'core/paragraph', {
						placeholder: __( 'Dialog contents is here!', 'mone' ),
					} ),
				]
			),
		]
	);
}
