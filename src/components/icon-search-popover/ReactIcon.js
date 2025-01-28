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
import { PhosphorIconList } from './icon-list/phosphor-icons';

export const FaIcons = { ..._FaIcons, ...FaIcons6 };

export const parseIconName = ( iconName ) => {
	// アイコン名から種類、タイプ、アイコン名を取得 ex: 'Phosphor_light_aperture';
	let iconKind, iconType, iconNamePart;
	if ( iconName?.includes( '_' ) ) {
		[ iconKind, iconType, iconNamePart ] = iconName.split( '_' );
	} else {
		iconKind = iconType = iconNamePart = iconName;
	}

	const iconObj = PhosphorIconList.find(
		( icon ) => icon.name === iconNamePart
	);
	if ( iconObj ) {
		return { iconKind, iconType, iconNamePart };
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
	if ( iconName === 'custom' || IconKinds( iconName ) === 'custom' ) {
		return true;
	}
	return false;
};

// プレフィックスからアイコン種類を判別
export const IconKinds = ( iconName ) => {
	if ( ! iconName ) {
		return 'custom';
	}

	const { iconKind } = parseIconName( iconName );
	if ( iconKind === 'Phosphor' ) {
		return 'phosphor';
	} else if ( iconName.startsWith( 'Fi' ) && fiIcons.includes( iconName ) ) {
		return 'fi';
	} else if ( iconName.startsWith( 'Fa' ) && faIcons.includes( iconName ) ) {
		return 'fa';
	} else if ( iconName.startsWith( 'Io' ) && ioIcons.includes( iconName ) ) {
		return 'io';
	}
	return 'custom';
};

const getSvgHtml = ( iconName, _iconType ) => {
	const iconObj = PhosphorIconList.find( ( icon ) => icon.name === iconName );
	if ( iconObj ) {
		const iconTypeObj = iconObj.iconList.find(
			( icon ) => icon.type === _iconType
		);
		return iconTypeObj ? iconTypeObj.svgHtml : null;
	}
	return null;
};

export const ReactIcon = ( {
	iconName,
	className = '',
	size = undefined,
	style = { fill: 'none' },
} ) => {
	const { iconKind, iconType, iconNamePart } = parseIconName( iconName );
	if ( iconKind === 'Phosphor' ) {
		return getSvgHtml( iconNamePart, iconType );
	}

	if ( IconKinds( iconName ) === 'fi' ) {
		return createElement( FiIcons[ iconName ], { size, className, style } );
	} else if ( IconKinds( iconName ) === 'fa' ) {
		return createElement( FaIcons[ iconName ], { size, className } );
	} else if ( IconKinds( iconName ) === 'io' ) {
		return createElement( IoIcons[ iconName ], { size, className } );
	}
	// return ({
	// 	parseIcon( svg )
	// });

	// return createElement( parseIcon( svg ) );

	return null;
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
