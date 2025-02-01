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

function parseCSS( css = '' ) {
	return css.split( ';' ).reduce( ( accumulator, rule ) => {
		if ( rule ) {
			const [ property, value ] = rule.split( ':' );
			if ( property === 'font-size' ) {
				accumulator.fontSize = value;
			}
		}
		return accumulator;
	}, {} );
}

export function parseClassName( className = '', fontSettings ) {
	return className.split( ' ' ).reduce( ( accumulator, name ) => {
		if ( name.startsWith( 'has-' ) && name.endsWith( '-font-size' ) ) {
			const fontSlug = name
				.replace( /^has-/, '' )
				.replace( /-font-size$/, '' );
			const fontSizeObject = getFontSize( fontSettings, fontSlug );
			accumulator.fontSize = fontSizeObject.size;
		}
		return accumulator;
	}, {} );
}

export function getActiveInlineFontSize( value, name, fontSizesSettings ) {
	const activeInlineFontSizeFormat = getActiveFormat( value, name );

	if ( ! activeInlineFontSizeFormat ) {
		return {};
	}

	return {
		...parseCSS( activeInlineFontSizeFormat.attributes.style ),
		...parseClassName(
			activeInlineFontSizeFormat.attributes.class,
			fontSizesSettings
		),
	};
}

function setFontSize( value, name, fontSizesSettings, newFontSize ) {
	const { fontSize } = {
		...getActiveInlineFontSize( value, name, fontSizesSettings ),
		fontSize: newFontSize,
	};

	if ( newFontSize === false ) {
		return removeFormat( value, name );
	}

	if ( ! fontSize ) {
		return removeFormat( value, name );
	}

	const styles = [];
	const classNames = [];
	const attributes = {};

	if ( fontSize ) {
		const fontSizeSlug = getFontSizeObjectByValue(
			fontSizesSettings,
			fontSize
		);

		if ( fontSizeSlug?.slug ) {
			classNames.push( `has-${ fontSizeSlug.slug }-font-size` );
		} else {
			styles.push( [ 'font-size', fontSizeSlug.size ].join( ':' ) );
		}
	}

	if ( styles.length ) {
		attributes.style = styles.join( ';' );
	}
	if ( classNames.length ) {
		attributes.class = classNames.join( ' ' );
	}

	return applyFormat( value, { type: name, attributes } );
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

	const [ fontSizes ] = useSettings( 'typography.fontSizes' );
	const activeFontSize = useMemo(
		() => getActiveInlineFontSize( value, name, fontSizes ),
		[ value, name, fontSizes ]
	);

	return (
		<div style={ pickerStyle }>
			<FontSizePicker
				fontSizes={ fontSizes }
				value={ activeFontSize.fontSize }
				onChange={ ( newFontSize ) => {
					onChange(
						setFontSize( value, name, fontSizes, newFontSize )
					);
				} }
				withReset={ false }
			/>
			<HStack alignment="right">
				<Button
					onClick={ () => {
						onChange(
							setFontSize( value, name, fontSizes, false )
						);
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
