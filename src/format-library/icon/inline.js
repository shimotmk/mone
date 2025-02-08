/**
 * WordPress dependencies
 */
import {
	applyFormat,
	insert,
	create,
	useAnchor,
	getActiveFormat,
} from '@wordpress/rich-text';
import {
	useCachedTruthy,
	store as blockEditorStore,
	getColorObjectByAttributeValues,
	getGradientValueBySlug,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	getFontSize,
	useSettings,
} from '@wordpress/block-editor';
import { Modal } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { inlineIconSettings as settings } from './index';
import {
	createSvgUrl,
	decodeSvgBase64,
} from '../../components/icon-search-popover/ReactIcon';
import { IconPopoverContent } from '../../components/icon-search-popover';
import { stringToArrayClassName } from '../../utils-func/class-name/classAttribute';

function parseCSS( css = '', colorSettings, colorGradientSettings ) {
	const rules = [];
	let rule = '';
	let insideUrl = false;

	for ( let i = 0; i < css.length; i++ ) {
		const char = css[ i ];
		if ( char === ';' && ! insideUrl ) {
			rules.push( rule.trim() );
			rule = '';
		} else {
			rule += char;
			if ( char === '(' && rule.includes( 'url' ) ) {
				insideUrl = true;
			} else if ( char === ')' ) {
				insideUrl = false;
			}
		}
	}
	if ( rule.trim() ) {
		rules.push( rule.trim() );
	}
	const obj = {};
	rules.forEach( ( _rule ) => {
		const [ property, ...valueParts ] = _rule.split( ':' );
		const value = valueParts.join( ':' ).trim();
		if ( property && value ) {
			if ( property === '--the-icon-color' ) {
				const colorSlug = value
					.replace( 'var(--wp--preset--color--', '' )
					.replace( ')', '' );
				const colorValue = value.startsWith(
					'var(--wp--preset--color--'
				)
					? getColorObjectByAttributeValues(
							colorSettings,
							colorSlug
					  ).color
					: value;
				obj[ property.trim() ] = colorValue;
			} else if ( property === '--the-icon-gradient-color' ) {
				const gradientValue = value.startsWith(
					'var(--wp--preset--gradient--'
				)
					? colorGradientSettings &&
					  getGradientValueBySlug(
							colorGradientSettings,
							value
								.replace( 'var(--wp--preset--gradient--', '' )
								.replace( ')', '' )
					  )
					: value;
				obj[ property.trim() ] = gradientValue;
			} else {
				obj[ property ] = value;
			}
		}
	} );

	return obj;
}

function parseClassName( className = '', fontSettings ) {
	const classArray = stringToArrayClassName( className );
	const obj = {};

	classArray.forEach( ( name ) => {
		if ( name.startsWith( 'has-' ) && name.endsWith( '-font-size' ) ) {
			const fontSlug = name
				.replace( /^has-/, '' )
				.replace( /-font-size$/, '' );
			const fontSizeObject = getFontSize( fontSettings, fontSlug );
			obj[ 'font-size' ] = fontSizeObject.size;
		}
	} );

	return obj;
}

export function getActiveIcons( {
	value,
	name,
	colorSettings,
	colorGradientSettings,
	fontSettings,
} ) {
	const activeFormat = getActiveFormat( value, name );

	if ( ! activeFormat ) {
		return {};
	}

	return {
		...parseCSS(
			activeFormat.attributes?.style,
			colorSettings,
			colorGradientSettings
		),
		...parseCSS(
			activeFormat.unregisteredAttributes?.style,
			colorSettings,
			colorGradientSettings
		),
		...parseClassName( activeFormat.attributes.class, fontSettings ),
	};
}

export function hasIconFormat(
	value,
	name,
	colorSettings,
	colorGradientSettings,
	fontSettings
) {
	const activeFormat = getActiveIcons( {
		value,
		name,
		colorSettings,
		colorGradientSettings,
		fontSettings,
	} );

	return activeFormat[ '--the-icon-name' ] || activeFormat[ '--the-icon-svg' ]
		? true
		: false;
}

function InlineIconPicker( { name, value, onChange, setIsAdding } ) {
	const colorSettings = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const [ fontSizes ] = useSettings( 'typography.fontSizes' );
	const activeIcons = useMemo(
		() =>
			getActiveIcons( {
				value,
				name,
				colorSettings,
				colorGradientSettings: gradientValues,
				fontSettings: fontSizes,
			} ),
		[ name, value, colorSettings, gradientValues, fontSizes ]
	);

	const getInsertIconValue = ( iconValue ) => {
		const SVG = iconValue.iconSVG;
		const iconName = iconValue.iconName;
		const dataSvg = createSvgUrl( SVG );

		const _activeFormat = getActiveFormat( value, name );
		if ( ! _activeFormat ) {
			value.activeFormats = {};
		}

		let newValue = value;
		let html = '';
		html += `<span class="mone-inline-icon" aria-hidden="true" style="--the-icon-name:${ iconName }; --the-icon-svg:url(${ dataSvg });" >&emsp;</span>`;
		newValue = insert(
			newValue,
			applyFormat( create( { html } ), {
				type: name,
				attributes: {
					class: 'mone-inline-icon',
				},
			} )
		);

		onChange( newValue );
		setIsAdding( false );
	};

	return (
		<IconPopoverContent
			value={ activeIcons[ '--the-icon-name' ] || '' }
			iconSVG={
				decodeSvgBase64(
					activeIcons[ '--the-icon-svg' ]?.replace(
						/^url\(|\)$/g,
						''
					)
				) || ''
			}
			onChange={ getInsertIconValue }
			setIsVisible={ setIsAdding }
		/>
	);
}

export default function InlineIconUI( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	setIsAdding,
} ) {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );
	const cachedRect = useCachedTruthy( popoverAnchor.getBoundingClientRect() );
	popoverAnchor.getBoundingClientRect = () => cachedRect;

	return (
		<Modal className="mone-icon-modal" onRequestClose={ onClose }>
			<InlineIconPicker
				name={ name }
				value={ value }
				onChange={ onChange }
				setIsAdding={ setIsAdding }
			/>
		</Modal>
	);
}
