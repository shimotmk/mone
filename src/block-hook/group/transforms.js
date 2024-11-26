import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';

export const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/paragraph' ],
			transform: ( attributes ) => {
				const { content } = attributes;

				return createBlock(
					'core/group',
					{
						style: {
							color: { background: '#f7fff0', text: '#000000b3' },
							spacing: {
								padding: {
									top: 'var:preset|spacing|10',
									bottom: 'var:preset|spacing|10',
									left: 'var:preset|spacing|10',
									right: 'var:preset|spacing|10',
								},
								blockGap: '0.5rem',
							},
						},
						layout: {
							type: 'flex',
							flexWrap: 'nowrap',
							verticalAlignment: 'top',
						},
					},
					createBlocksFromInnerBlocksTemplate( [
						[
							'core/paragraph',
							{
								align: 'center',
								style: {
									color: { text: '#fefefe' },
									elements: {
										link: { color: { text: '#fefefe' } },
									},
									spacing: {
										padding: {
											top: '4px',
											bottom: '4px',
											left: '0px',
											right: '0px',
										},
									},
									typography: { lineHeight: '1' },
									layout: {
										selfStretch: 'fixed',
										flexSize: '25px',
									},
								},
								content: '✅',
							},
						],
						[
							'core/paragraph',
							{
								style: {
									typography: { lineHeight: '1.6' },
									layout: {
										selfStretch: 'fixed',
										flexSize: '95%',
									},
								},
								content,
							},
							createBlocksFromInnerBlocksTemplate( [] ),
						],
					] )
				);
			},
		},
	],
};
