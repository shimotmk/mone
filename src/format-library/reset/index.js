/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	removeFormat,
	registerFormatType,
	store as richTextStore,
} from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { help } from '@wordpress/icons';
import { select } from '@wordpress/data';

const name = 'mone/reset';
const title = __( 'Reset Formatting', 'mone' );

export const unknown = {
	name,
	title,
	tagName: '*',
	className: null,
	edit( { value, onChange, onFocus } ) {
		const formatTypeList = select( richTextStore ).getFormatTypes();
		const nameList = formatTypeList.map( ( format ) => format.name );

		function onClick() {
			nameList.forEach( ( _name ) => {
				onChange( removeFormat( value, _name ) );
			} );
			onFocus();
		}

		return (
			<RichTextToolbarButton
				name="moneMenu"
				icon={ help }
				title={ title }
				onClick={ onClick }
			/>
		);
	},
};
registerFormatType( name, unknown );
