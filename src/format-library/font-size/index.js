/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';
import { registerFormatType, removeFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { fontSizeIcon } from '../../icons';
import { default as InlineFontSizeUI, getActiveInlineFontSize } from './inline';

const name = 'mone/inline-font-size';

function FontSizeEdit( {
	value,
	onChange,
	isActive,
	activeAttributes,
	contentRef,
} ) {
	const shortcutType = 'primary';
	const shortcutChar = 'h';

	const [ isSettingFontSize, setIsSettingFontSize ] = useState( false );

	const enableIsAddingFontSize = useCallback(
		() => setIsSettingFontSize( true ),
		[ setIsSettingFontSize ]
	);
	const disableIsAddingFontSize = useCallback(
		() => setIsSettingFontSize( false ),
		[ setIsSettingFontSize ]
	);

	const activeInlineFontSize = getActiveInlineFontSize( value, name );

	const hasFontSizeToChoose = !!! value.length || ! activeInlineFontSize;
	if ( ! hasFontSizeToChoose && ! isActive ) {
		return null;
	}

	return (
		<>
			<RichTextToolbarButton
				name="moneMenu"
				title={ __( 'Inline Font Size', 'mone' ) }
				onClick={
					hasFontSizeToChoose
						? enableIsAddingFontSize
						: () => onChange( removeFormat( value, name ) )
				}
				shortcutType={ shortcutType }
				shortcutCharacter={ shortcutChar }
				className="format-library-text-color-button"
				isActive={ isActive }
				icon={ fontSizeIcon }
			/>
			{ isSettingFontSize && (
				<InlineFontSizeUI
					name={ name }
					onClose={ disableIsAddingFontSize }
					activeAttributes={ activeAttributes }
					value={ value }
					onChange={ onChange }
					contentRef={ contentRef }
					setIsSettingFontSize={ setIsSettingFontSize }
					isActive={ isActive }
				/>
			) }
		</>
	);
}

export const inlineFontSize = {
	title: __( 'Inline font size', 'mone' ),
	tagName: 'span',
	className: 'mone_inline-font-size',
	attributes: {
		data: 'data-fontSize',
		class: 'class',
		style: 'style',
	},
	edit: FontSizeEdit,
};
registerFormatType( name, inlineFontSize );
