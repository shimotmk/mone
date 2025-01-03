import { useSelect } from '@wordpress/data';
import {
	removeFormat,
	registerFormatType,
	store as richTextStore,
} from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';
import { RichTextToolbarButton } from '@wordpress/block-editor';

import { Eraser } from '../../icons';

const name = 'mone/remove';
const title = __( 'Remove Format', 'mone' );

const Edit = ( { value, onChange } ) => {
	const formatTypes = useSelect(
		( select ) => select( richTextStore ).getFormatTypes(),
		[]
	);

	const onClick = () => {
		if ( formatTypes.length > 0 ) {
			let newValue = value;
			formatTypes.forEach( ( formatType ) => {
				newValue = removeFormat( newValue, formatType.name );
			} );
			onChange( { ...newValue } );
		}
	};

	return (
		<RichTextToolbarButton
			name="moneMenu"
			icon={ Eraser }
			title={ title }
			onClick={ onClick }
		/>
	);
};

export const settings = {
	name,
	title,
	tagName: 'span',
	className: 'mone-reset-format',
	edit: Edit,
};

registerFormatType( name, settings );
