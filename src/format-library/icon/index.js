import { __ } from '@wordpress/i18n';
import {
	RichTextToolbarButton,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	store as blockEditorStore,
	useSettings,
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
	const colorSettings = useSelect( ( _select ) => {
		const { getSettings } = _select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const [ fontSizes ] = useSettings( 'typography.fontSizes' );

	const [ isAdding, setIsAdding ] = useState( false );
	const disableIsAdding = useCallback(
		() => setIsAdding( false ),
		[ setIsAdding ]
	);

	const activeFormat = getActiveIcons( {
		colorSettings,
		colorGradientSettings: gradientValues,
		fontSizes,
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
			{ isObjectActive && (
				<StyleInlineIconUI
					name={ name }
					onClose={ disableIsAdding }
					activeObjectAttributes={ activeObjectAttributes }
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
