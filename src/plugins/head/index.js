/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalVStack as VStack,
	Button,
	Flex,
	FlexItem,
} from '@wordpress/components';

export const Head = () => {
	return (
		<>
			<VStack style={ { padding: '5px 16px' } }>
				<Flex justify="flex-end">
					<FlexItem>
						<Button
							variant="tertiary"
							isDestructive={ true }
							size="compact"
						>
							{ __( 'Reset', 'mone' ) }
						</Button>
					</FlexItem>
					<FlexItem>
						<Button variant="primary" size="compact">
							{ __( 'Save', 'mone' ) }
						</Button>
					</FlexItem>
				</Flex>
			</VStack>
		</>
	);
};
