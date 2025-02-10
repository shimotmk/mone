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

export function parseCSS( css = '', colorSettings, colorGradientSettings ) {
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

function parseClassName( className = '' ) {
	const classArray = stringToArrayClassName( className );
	const obj = {};

	const filteredClasses = classArray.filter(
		( _className ) => _className !== 'mone-inline-icon-wrapper'
	);

	if ( filteredClasses.length ) {
		obj.className = filteredClasses.join( ' ' );
	}

	return obj;
}

export function getActiveIcons( {
	colorSettings,
	colorGradientSettings,
	activeObjectAttributes,
} ) {
	if ( ! activeObjectAttributes ) {
		return {};
	}

	const returnObj = {
		...parseCSS(
			activeObjectAttributes?.style,
			colorSettings,
			colorGradientSettings
		),
		...parseClassName( activeObjectAttributes?.class ),
	};

	return returnObj;
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
	const activeIcons = useMemo(
		() =>
			getActiveIcons( {
				colorSettings,
				colorGradientSettings: gradientValues,
			} ),
		[ colorSettings, gradientValues ]
	);

	const getInsertIconValue = ( iconValue ) => {
		const SVG = iconValue.iconSVG;
		const iconName = iconValue.iconName || 'custom';
		const dataSvg = createSvgUrl( SVG );

		const _activeFormat = getActiveFormat( value, name );
		if ( ! _activeFormat ) {
			value.activeFormats = {};
		}

		let newValue = value;
		const html = `<span class="mone-inline-icon mone-inline-icon-wrapper" aria-hidden="true" style="--the-icon-name:${ iconName }; --the-icon-svg:url(${ dataSvg })">${ SVG }</span>`;
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
