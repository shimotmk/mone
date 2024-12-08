/**
 * WordPress dependencies
 */
import { Flex, FlexItem } from '@wordpress/components';

import { InfoPopover } from '../info-popover';
import './editor.scss';

export const InfoPopoverLabel = ( props ) => {
	const { label } = props;

	return (
		<Flex justify="flex-start" gap="0">
			<FlexItem>{ label }</FlexItem>
			<FlexItem
				style={ {
					height: '20px',
				} }
			>
				<InfoPopover { ...props } />
			</FlexItem>
		</Flex>
	);
};
