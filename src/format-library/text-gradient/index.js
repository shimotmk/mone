import { __ } from '@wordpress/i18n';
import {
	RichTextToolbarButton,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { registerFormatType } from '@wordpress/rich-text';
import { useState, useCallback, useMemo } from '@wordpress/element';
import { ColorIndicator } from '@wordpress/components';

import { default as InlineIconUI, getActiveColors } from './inline';

export const transparentValue = 'transparent';
const name = 'mone/gradient-text';

const InlineGradient = ( props ) => {
	const { value, onChange, contentRef, activeAttributes, isActive } = props;

	const [ isAdding, setIsAdding ] = useState( false );
	const disableIsAdding = useCallback(
		() => setIsAdding( false ),
		[ setIsAdding ]
	);

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const activeColors = useMemo(
		() => getActiveColors( value, name, gradientValues ),
		[ value, gradientValues ]
	);

	return (
		<>
			<RichTextToolbarButton
				name="moneMenu"
				className="format-library-text-color-button"
				isActive={ isActive }
				title={ __( 'テキスト グラデーション', 'mone' ) }
				icon={
					<ColorIndicator
						colorValue={ activeColors.gradientColor ?? undefined }
					/>
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
	title: __( 'Text Gradient', 'mone' ),
	tagName: 'span',
	className: 'mone-has-gradient',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: InlineGradient,
};
registerFormatType( name, inlineSettings );
