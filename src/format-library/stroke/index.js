import { __ } from '@wordpress/i18n';
import {
	RichTextToolbarButton,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { registerFormatType } from '@wordpress/rich-text';
import { useState, useCallback, useMemo } from '@wordpress/element';
import { ColorIndicator } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { default as InlineIconUI, getActiveColors } from './inline';
import clsx from 'clsx';

const name = 'mone/stroke';
const title = __( 'Stroke', 'mone' );

const InlineStroke = ( props ) => {
	const { value, onChange, contentRef, activeAttributes, isActive } = props;

	const [ isAdding, setIsAdding ] = useState( false );
	const disableIsAdding = useCallback(
		() => setIsAdding( false ),
		[ setIsAdding ]
	);

	const colors = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const activeColors = useMemo(
		() => getActiveColors( value, name, colors ),
		[ value, colors ]
	);

	return (
		<>
			<RichTextToolbarButton
				name="moneMenu"
				className="format-library-text-color-button"
				isActive={ isActive }
				title={ title }
				icon={
					<span
						className={ clsx( 'mone-color-indicator-button', {
							'is-active': isActive,
						} ) }
					>
						<ColorIndicator
							colorValue={ activeColors.strokeColor ?? undefined }
						/>
					</span>
				}
				onClick={ () => {
					setIsAdding( true );
				} }
				role="menuitemcheckbox"
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

export const inlineSettings = {
	title,
	tagName: 'span',
	className: 'mone-has-stroke',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: InlineStroke,
};
registerFormatType( name, inlineSettings );
