import { __ } from '@wordpress/i18n';
import {
	RichTextToolbarButton,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	registerFormatType,
	store as richTextStore,
} from '@wordpress/rich-text';
import { useState, useCallback } from '@wordpress/element';
import { select, useSelect } from '@wordpress/data';

import { fontSizeIcon } from '../../icons';
import { default as InlineIconUI, getActiveIcons } from './inline';
import { default as StyleInlineIconUI } from './style-inline';
import { decodeSvgBase64 } from '../../components/icon-search-popover/ReactIcon';
import { parseIcon } from '../../components/icon-search-popover/utils/parse-icon';
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

	const colorSettings = useSelect( ( _select ) => {
		const { getSettings } = _select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const activeFormat = getActiveIcons( {
		colorSettings,
		colorGradientSettings: gradientValues,
		activeObjectAttributes,
	} );
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
				isActive={ isActive || isObjectActive }
				name="moneMenu"
				title={ __( 'Icon', 'mone' ) }
				icon={ svg }
				onClick={ () => {
					if ( ! isObjectActive ) {
						setIsAdding( true );
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
