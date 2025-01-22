/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSettings } from '@wordpress/block-editor';
import {
	FontSizePicker,
	Button,
	__experimentalHStack as HStack,
} from '@wordpress/components';

export function Size( { activeIcons, onIconChange } ) {
	const [ fontSizesSettings ] = useSettings( 'typography.fontSizes' );

	const buttonStyle = {
		marginTop: '16px',
		height: '30px',
	};

	return (
		<>
			<div>
				<FontSizePicker
					fontSizes={ fontSizesSettings }
					value={ activeIcons[ 'font-size' ] }
					onChange={ ( newValue ) => {
						onIconChange( { 'font-size': newValue } );
					} }
					withReset={ false }
				/>
				<HStack alignment="right">
					<Button
						onClick={ () => {
							onIconChange( { 'font-size': undefined } );
						} }
						variant="secondary"
						style={ buttonStyle }
					>
						{ __( 'Clear' ) }
					</Button>
				</HStack>
			</div>
		</>
	);
}
