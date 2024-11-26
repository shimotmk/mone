const example = {
	attributes: {
		url: 'https://wordpress.org/',
		isLink: true,
		linkTarget: '_blank',
		style: {
			spacing: {
				padding: {
					top: '1rem',
					right: '1rem',
					bottom: '1rem',
					left: '1rem',
				},
			},
			border: {
				color: '#0000001f',
				width: '1px',
			},
		},
	},
	innerBlocks: [
		{
			name: 'core/columns',
			attributes: {
				isStackedOnMobile: false,
				style: {
					spacing: { blockGap: { top: '1.5rem', left: '1.5rem' } },
				},
			},
			innerBlocks: [
				{
					name: 'core/column',
					attributes: {
						verticalAlignment: 'top',
						width: '25%',
					},
					innerBlocks: [
						{
							name: 'mone/embed-featured-image',
							attributes: {
								aspectRatio: '1',
							},
						},
					],
				},
				{
					name: 'core/column',
					attributes: {
						lock: {
							move: false,
							remove: true,
						},
						width: '75%',
					},
					innerBlocks: [
						{
							name: 'mone/embed-title',
							attributes: {
								isLink: true,
								linkTarget: '_blank',
								style: {
									typography: {
										fontStyle: 'normal',
										fontWeight: '600',
										lineHeight: '1.5',
									},
								},
							},
						},
						{
							name: 'mone/embed-excerpt',
							attributes: {
								style: {
									elements: {
										link: {
											color: {
												text: 'var:preset|color|content-contrast-2',
											},
										},
									},
									spacing: {
										margin: {
											top: '0',
											bottom: '0',
										},
									},
								},
								textColor: 'content-contrast-2',
								fontSize: 'small',
							},
						},
					],
				},
			],
		},
	],
};
export default example;
