import { __ } from '@wordpress/i18n';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import {
	registerFormatType,
	store as richTextStore,
} from '@wordpress/rich-text';
import { useState, useCallback } from '@wordpress/element';
import { select } from '@wordpress/data';

import { fontSizeIcon } from '../../icons';
import { default as InlineIconUI } from './inline';
import { default as StyleInlineIconUI } from './style-inline';

import './style.scss';

const name = 'mone/inline-icon';

const InlineIcon = ( props ) => {
	const {
		value,
		onChange,
		contentRef,
		activeAttributes,
		isActive,
		isObjectActive,
		activeObjectAttributes,
	} = props;
	const [ isAdding, setIsAdding ] = useState( false );
	const [ openPopOver, setOpenPopOver ] = useState( false );
	const disableIsAdding = useCallback( () => {
		setIsAdding( false );
		setOpenPopOver( false );
	}, [ setIsAdding, setOpenPopOver ] );

	return (
		<>
			<RichTextToolbarButton
				isActive={ isActive || isObjectActive }
				name="moneMenu"
				title={ __( 'Icon', 'mone' ) }
				icon={ fontSizeIcon }
				onClick={ () => {
					if ( ! isObjectActive ) {
						setIsAdding( true );
						setOpenPopOver( true );
					} else {
						setOpenPopOver( true );
					}
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
			{ openPopOver && (
				<StyleInlineIconUI
					name={ name }
					onClose={ disableIsAdding }
					activeObjectAttributes={ activeObjectAttributes }
					value={ value }
					onChange={ onChange }
					contentRef={ contentRef }
					setIsAdding={ setIsAdding }
					openPopOver={ openPopOver }
				/>
			) }
		</>
	);
};

export const inlineIconSettings = {
	title: __( 'Inline Icon', 'mone' ),
	tagName: 'span',
	className: 'mone-inline-icon',
	attributes: {
		class: 'class',
		style: 'style',
	},
	edit: InlineIcon,
	contentEditable: false,
};

if ( ! select( richTextStore ).getFormatType( name ) ) {
	registerFormatType( name, inlineIconSettings );
}
