/**
 * WordPress dependencies
 */
import { createElement, renderToString } from '@wordpress/element';

/**
 * External dependencies
 */
import * as _FaIcons from 'react-icons/fa';
import * as FaIcons6 from 'react-icons/fa6';
import * as IoIcons from 'react-icons/io5';
import * as FiIcons from 'react-icons/fi';

/**
 * Internal dependencies
 */
import { fiIcons } from './icon-list/feather-icons';
import { faIcons } from './icon-list/fa-icons';
import { ioIcons } from './icon-list/io-icons';
import { PHOSPHOR_ICONS, getPhosphorIconSvg } from './icon-list/phosphor-icons';

export const FaIcons = { ..._FaIcons, ...FaIcons6 };

export const parseIconName = ( iconName ) => {
	// アイコン名から種類、タイプ、アイコン名を取得 ex: 'Ph_light_aperture';
	let iconKind, iconNamePart, iconType;
	if ( iconName?.includes( '_' ) ) {
		const parts = iconName.split( '_' );
		iconKind = parts[ 0 ];
		iconNamePart = parts[ 1 ];
		iconType = parts[ 2 ];
	} else {
		iconKind = iconType = iconNamePart = iconName;
	}

	const iconObj = PHOSPHOR_ICONS.find( ( icon ) => icon === iconName );
	if ( iconObj ) {
		return { iconKind, iconNamePart, iconType };
	}

	return {};
};

export const generateIconName = ( { iconKind, iconType, iconNamePart } ) => {
	if ( ! iconKind || ! iconType || ! iconNamePart ) {
		throw new Error(
			'All parts (iconKind, iconType, iconNamePart) must be provided'
		);
	}
	return `${ iconKind }_${ iconType }_${ iconNamePart }`;
};

export const isCustomIcon = ( iconName ) => {
	if ( iconName === 'custom' ) {
		return true;
	}
	if ( ReactIconKinds( iconName ) === null ) {
		return true;
	}
	return false;
};

export const ReactIconKinds = ( iconName ) => {
	if ( ! iconName ) {
		return null;
	}

	// プレフィックスからアイコン種類を判別
	if ( iconName.startsWith( 'Fi' ) && FiIcons[ iconName ] !== undefined ) {
		return 'fi';
	} else if (
		iconName.startsWith( 'Fa' ) &&
		FaIcons[ iconName ] !== undefined
	) {
		return 'fa';
	} else if (
		iconName.startsWith( 'Io' ) &&
		IoIcons[ iconName ] !== undefined
	) {
		return 'io';
	} else if (
		iconName.startsWith( 'Ph' ) &&
		PHOSPHOR_ICONS.includes( iconName )
	) {
		return 'ph';
	}
	return null;
};

export const ReactIcon = ( {
	iconName,
	className = '',
	size = undefined,
	style = { fill: 'none' },
} ) => {
	if ( ReactIconKinds( iconName ) === 'fi' ) {
		return createElement( FiIcons[ iconName ], { size, className, style } );
	} else if ( ReactIconKinds( iconName ) === 'fa' ) {
		return createElement( FaIcons[ iconName ], { size, className } );
	} else if ( ReactIconKinds( iconName ) === 'io' ) {
		return createElement( IoIcons[ iconName ], { size, className } );
	} else if ( ReactIconKinds( iconName ) === 'ph' ) {
		const phosphorIcons = getPhosphorIconSvg( iconName );
		return phosphorIcons;
	}
};

export const IconExternalLink = ( { icon } ) => {
	const SVG = renderToString( <ReactIcon iconName={ icon } /> );
	return 'data:image/svg+xml,' + encodeURIComponent( SVG );
};

export const createSvgUrl = ( svgString ) => {
	// NOTE: escape関数やunescape関数は非推奨なので注意。
	const encodedSvgString = encodeURIComponent( svgString );
	const svgBase64 = window.btoa( decodeURIComponent( encodedSvgString ) );

	const imageSrc = `data:image/svg+xml;base64,${ svgBase64 }`;
	return imageSrc;
};

export const decodeSvgBase64 = ( encodedSvgUrl ) => {
	if ( ! encodedSvgUrl ) {
		return '';
	}
	const base64Data = encodedSvgUrl.split( ',' )[ 1 ];
	const decodedString = window.atob( base64Data );
	const svgString = decodeURIComponent( decodedString );
	return svgString;
};
