import { __ } from '@wordpress/i18n';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import {
	registerFormatType,
	store as richTextStore,
} from '@wordpress/rich-text';
import { useState, useCallback } from '@wordpress/element';
import { select } from '@wordpress/data';

import { fontSizeIcon } from '../../icons';
import { default as InlineIconUI, getActiveIcons } from './inline';
import { decodeSvgBase64 } from '../../components/icon-search-popover/ReactIcon';
import { parseIcon } from '../../components/icon-search-popover/utils/parse-icon';

import './style.scss';

const name = 'mone/inline-icon';

const InlineIcon = ( props ) => {
	const { value, onChange, contentRef, activeAttributes, isActive } = props;

	const [ isAdding, setIsAdding ] = useState( false );
	const disableIsAdding = useCallback(
		() => setIsAdding( false ),
		[ setIsAdding ]
	);

	const activeFormat = getActiveIcons( value, name );
	const svg = activeFormat[ '--the-icon-svg' ]
		? parseIcon(
				decodeSvgBase64(
					activeFormat[ '--the-icon-svg' ].replace(
						/^url\(|\)$/g,
						''
					)
				)
		  )
		: fontSizeIcon;

	return (
		<>
			<RichTextToolbarButton
				isActive={ isActive }
				name="moneMenu"
				title={ __( 'Icon', 'mone' ) }
				icon={ svg }
				onClick={ () => {
					setIsAdding( true );
				} }
			/>
			{ isAdding && (
				<InlineIconUI
					name={ name }
					onClose={ disableIsAdding }
					activeAttributes={ activeAttributes }
					value={ value }
					onChange={ onChange }
					contentRef={ contentRef }
					setIsAdding={ setIsAdding }
				/>
			) }
		</>
	);
};

export const inlineIconSettings = {
	title: __( 'Inline Icon', 'mone' ),
	tagName: 'span',
	className: 'mone-inline-icon',
	edit: InlineIcon,
};

if ( ! select( richTextStore ).getFormatType( name ) ) {
	registerFormatType( name, inlineIconSettings );
}
