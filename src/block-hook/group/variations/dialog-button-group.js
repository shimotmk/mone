/**
 * External dependencies
 */
import { v4 as createId } from 'uuid';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { dialogIcon as icon } from '../../../icons';

// inserterをクリックしたときにcreateIdが使えるようになったら、このコードを使えるかもしれない。現時点では動作していない
export const dialogButtonGroup = {
	name: 'mone/dialog-button-group',
	title: __( 'Dialog button', 'mone' ),
	description: __( 'A group that contains a button and a dialog.', 'mone' ),
	category: 'mone-block-cat',
	attributes: {
		metadata: {
			patternName: 'mone/dialog-button-group',
			name: __( 'Dialog button', 'mone' ),
		},
		layout: {
			type: 'constrained',
		},
	},
	icon,
	scope: [ 'inserter' ],
	isActive: ( blockAttributes ) =>
		blockAttributes?.metadata?.patternName === 'mone/dialog-button-group',
	innerBlocks: [
		[
			'core/buttons',
			{
				layout: 'flex',
				justifyContent: 'center',
			},
			[
				[
					'core/button',
					{
						tagName: 'button',
						className: 'mone-dialog-trigger',
						moneDialogId: `#dialog-${ createId() }`,
						placeholder: __( 'Dialog trigger button', 'mone' ),
						text:
							'<span aria-hidden="true" class="mone-inline-icon mone-inline-icon-wrapper" style="--the-icon-name:FaSearchPlus; --the-icon-svg:url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9ImN1cnJlbnRDb2xvciIgZmlsbD0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjAiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzA0IDE5MnYzMmMwIDYuNi01LjQgMTItMTIgMTJoLTU2djU2YzAgNi42LTUuNCAxMi0xMiAxMmgtMzJjLTYuNiAwLTEyLTUuNC0xMi0xMnYtNTZoLTU2Yy02LjYgMC0xMi01LjQtMTItMTJ2LTMyYzAtNi42IDUuNC0xMiAxMi0xMmg1NnYtNTZjMC02LjYgNS40LTEyIDEyLTEyaDMyYzYuNiAwIDEyIDUuNCAxMiAxMnY1Nmg1NmM2LjYgMCAxMiA1LjQgMTIgMTJ6bTIwMSAyODQuN0w0NzYuNyA1MDVjLTkuNCA5LjQtMjQuNiA5LjQtMzMuOSAwTDM0MyA0MDUuM2MtNC41LTQuNS03LTEwLjYtNy0xN1YzNzJjLTM1LjMgMjcuNi03OS43IDQ0LTEyOCA0NEM5My4xIDQxNiAwIDMyMi45IDAgMjA4UzkzLjEgMCAyMDggMHMyMDggOTMuMSAyMDggMjA4YzAgNDguMy0xNi40IDkyLjctNDQgMTI4aDE2LjNjNi40IDAgMTIuNSAyLjUgMTcgN2w5OS43IDk5LjdjOS4zIDkuNCA5LjMgMjQuNiAwIDM0ek0zNDQgMjA4YzAtNzUuMi02MC44LTEzNi0xMzYtMTM2UzcyIDEzMi44IDcyIDIwOHM2MC44IDEzNiAxMzYgMTM2IDEzNi02MC44IDEzNi0xMzZ6Ij48L3BhdGg+PC9zdmc+)"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M304 192v32c0 6.6-5.4 12-12 12h-56v56c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-56h-56c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h56v-56c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v56h56c6.6 0 12 5.4 12 12zm201 284.7L476.7 505c-9.4 9.4-24.6 9.4-33.9 0L343 405.3c-4.5-4.5-7-10.6-7-17V372c-35.3 27.6-79.7 44-128 44C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208c0 48.3-16.4 92.7-44 128h16.3c6.4 0 12.5 2.5 17 7l99.7 99.7c9.3 9.4 9.3 24.6 0 34zM344 208c0-75.2-60.8-136-136-136S72 132.8 72 208s60.8 136 136 136 136-60.8 136-136z"></path></svg></span>' +
							__( 'Dialog', 'mone' ),
					},
				],
			],
		],
		[
			'core/group',
			{
				tagName: 'dialog',
				metadata: {
					patternName: 'mone/dialog-content',
					name: __( 'Button Dialog', 'mone' ),
				},
				className: 'mone-dialog-container',
				style: {
					position: {
						type: 'fixed',
						top: '0px',
					},
					spacing: {
						padding: {
							right: '0',
							left: '0',
							top: '0',
							bottom: '0',
						},
					},
				},
				layout: {
					type: 'default',
				},
				anchor: `dialog-${ createId() }`,
			},
			[
				[
					'core/group',
					{
						lock: {
							move: true,
							remove: true,
						},
						metadata: {
							patternName: 'mone/dialog-content',
							name: __( 'Dialog content', 'mone' ),
						},
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
						layout: {
							type: 'default',
						},
					},
					[
						[
							'core/group',
							{
								metadata: {
									name: __( 'Dialog close area', 'mone' ),
								},
								style: {
									position: {
										type: 'sticky',
										top: '1.25rem',
										right: '0px',
									},
									layout: {
										type: 'constrained',
									},
								},
							},
							[
								[
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
										[
											'mone/icon',
											{
												width: '1.25rem',
												height: '1.25rem',
												tagName: 'button',
												iconSVG:
													'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>',
												metadata: {
													name: __(
														'Dialog close button',
														'mone'
													),
												},
											},
										],
									],
								],
							],
						],
						[
							'core/paragraph',
							{
								placeholder: __(
									'Dialog content is here!',
									'mone'
								),
							},
						],
					],
				],
			],
		],
	],
};
