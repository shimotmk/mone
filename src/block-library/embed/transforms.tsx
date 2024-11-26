/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

interface transformsType {
	from: {
		type: string;
		isMultiBlock: boolean;
		blocks: string[];
		transform: ( attributes: any ) => any;
	}[];
	to: {
		type: string;
		blocks: string[];
		transform: ( attributes: any ) => any;
	}[];
}

const transforms: transformsType = {
	from: [
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'core/embed' ],
			transform: ( attributes ) => {
				return createBlock( 'mone/embed', attributes );
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/embed' ],
			transform: ( attributes ) => {
				return createBlock( 'core/embed', attributes );
			},
		},
	],
};

export default transforms;
