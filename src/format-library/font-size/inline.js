/**
 * WordPress dependencies
 */
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';
import {
	useCachedTruthy,
	getFontSizeObjectByValue,
	getFontSize,
	useSettings,
} from '@wordpress/block-editor';
import {
	Popover,
	FontSizePicker,
	Button,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { inlineFontSize as settings } from './index';

function parseFontSize( fontSize = '' ) {
	return fontSize.replace( 'font-size:', '' );
}

export function getActiveInlineFontSize( value, name, fontSizes ) {
	const activeInlineFontSizeFormat = getActiveFormat( value, name );

	if ( ! activeInlineFontSizeFormat ) {
		return undefined;
	}

	const styleFontSize = activeInlineFontSizeFormat.attributes.style;
	if ( styleFontSize ) {
		return parseFontSize( activeInlineFontSizeFormat.attributes.style );
	}

	const moneFontSizeClass = activeInlineFontSizeFormat.attributes.class;
	if ( moneFontSizeClass ) {
		const moneFontSizeSlug = moneFontSizeClass.replace(
			/.*has-([^\s]*)-font-size.*/,
			'$1'
		);
		const fontSizeObject = getFontSize(
			fontSizes,
			moneFontSizeSlug,
			moneFontSizeSlug
		);
		const fontSizeValue = fontSizeObject?.size;
		return fontSizeValue;
	}
}

function InlineFontSizePicker( {
	name,
	value,
	onChange,
	setIsSettingFontSize,
} ) {
	const pickerStyle = {
		width: '200px',
	};
	const buttonStyle = {
		marginTop: '16px',
		height: '30px',
	};

	const onInlineFontSizeChange = ( newFontSize ) => {
		const fontSizeSlug = getFontSizeObjectByValue(
			fontSizes,
			newFontSize
		).slug;
		if ( ! newFontSize ) {
			onChange( removeFormat( value, name ) );
		} else if ( fontSizeSlug ) {
			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						class: `has-${ fontSizeSlug }-font-size`,
					},
				} )
			);
		} else {
			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						style: `font-size: ${ newFontSize };`,
					},
				} )
			);
		}
	};

	const [ fontSizes ] = useSettings( 'typography.fontSizes' );
	const activeFontSize = useMemo(
		() => getActiveInlineFontSize( name, value, fontSizes ),
		[ name, value, fontSizes ]
	);

	return (
		<div style={ pickerStyle }>
			<FontSizePicker
				fontSizes={ fontSizes }
				value={ activeFontSize }
				onChange={ onInlineFontSizeChange }
				withReset={ false }
				units={ [ '%', 'px', 'em', 'rem', 'vw', 'vh' ] }
			/>
			<HStack alignment="right">
				<Button
					onClick={ () => {
						onInlineFontSizeChange( false );
					} }
					variant="secondary"
					style={ buttonStyle }
				>
					{ __( 'Clear' ) }
				</Button>
				<Button
					onClick={ () => {
						setIsSettingFontSize( false );
					} }
					variant="primary"
					style={ buttonStyle }
				>
					{ __( 'Apply' ) }
				</Button>
			</HStack>
		</div>
	);
}

export default function InlineFontSizeUI( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	setIsSettingFontSize,
} ) {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );
	const cachedRect = useCachedTruthy( popoverAnchor.getBoundingClientRect() );
	popoverAnchor.getBoundingClientRect = () => cachedRect;

	return (
		<Popover
			onClose={ onClose }
			className="block-editor-format-toolbar__language-popover components-inline-color-popover"
			anchor={ popoverAnchor }
		>
			<InlineFontSizePicker
				name={ name }
				value={ value }
				onChange={ onChange }
				setIsSettingFontSize={ setIsSettingFontSize }
			/>
		</Popover>
	);
}
