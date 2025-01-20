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
import { useCachedTruthy } from '@wordpress/block-editor';
import { Modal } from '@wordpress/components';
import { renderToString } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { inlineIconSettings as settings } from './index';
import {
	ReactIcon,
	createSvgUrl,
	isCustomIcon,
	decodeSvgBase64,
} from '../../components/icon-search-popover/ReactIcon';
import { IconPopoverContent } from '../../components/icon-search-popover';

function parseCSS( css = '' ) {
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
			obj[ property.trim() ] = value;
		}
	} );

	return obj;
}

function parseClassName( className = '' ) {
	return className.split( ' ' );
}

export function getActiveIcons( value, name ) {
	const activeFormat = getActiveFormat( value, name );

	if ( ! activeFormat ) {
		return {};
	}

	return {
		...parseCSS( activeFormat.attributes.style ),
		...parseCSS( activeFormat.unregisteredAttributes.style ),
		...parseClassName( activeFormat.attributes.class ),
	};
}

function InlineIconPicker( { name, value, onChange, setIsAdding } ) {
	const getInsertIconValue = ( iconValue ) => {
		let SVG = '';
		let iconName = 'custom';
		const iconType = iconValue?.iconType || iconValue;
		if (
			typeof iconValue === 'object' &&
			iconValue !== null &&
			iconType === 'custom'
		) {
			SVG = isCustomIcon( iconType )
				? iconValue.iconSVG
				: renderToString( <ReactIcon iconName={ iconType } /> );
			iconName = iconType;
		} else if ( iconValue ) {
			SVG = isCustomIcon( iconValue )
				? iconValue.iconSVG
				: renderToString( <ReactIcon iconName={ iconValue } /> );
			iconName = iconValue;
		}
		const dataSvg = createSvgUrl( SVG );

		const activeFormat = getActiveFormat( value, name );
		if ( ! activeFormat ) {
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

	const activeColorFormat = getActiveIcons( value, name );
	console.log( 'activeColorFormat', activeColorFormat );

	return (
		<IconPopoverContent
			onChange={ getInsertIconValue }
			// value={searchValue}
			// iconSVG={ decodeSvgBase64 }
			value={ activeColorFormat[ '--the-icon-name' ] || '' }
			iconSVG={
				decodeSvgBase64(
					activeColorFormat[ '--the-icon-svg' ]?.replace(
						/^url\(|\)$/g,
						''
					)
				) || ''
			}
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
