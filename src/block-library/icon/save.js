/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Icon } from '@wordpress/icons';

import { blockCategoryIcon as icon } from './sample-icon';

export default function save( props ) {
	const { attributes } = props;
	const { width } = attributes;

	return (
		<div { ...useBlockProps.save( { style: { width } } ) }>
			<Icon icon={ icon } />
		</div>
	);
}
