const example = {
	attributes: {
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
			type: 'flex',
			justifyContent: 'center',
		},
	},
	innerBlocks: [
		{
			name: 'mone/icon',
			attributes: {
				iconGradient: 'gradient-4',
				iconName: 'FaWordpress',
				width: '100px',
				height: '100px',
			},
			innerBlocks: [],
		},
	],
};
export default example;
