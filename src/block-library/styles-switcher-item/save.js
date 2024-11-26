/**
 * WordPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

export default function save() {
	return <li { ...useInnerBlocksProps.save( useBlockProps.save() ) } />;
}
