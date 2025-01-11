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

import { PhosphorIconList } from './icon-list/phosphor-icons';

export const FaIcons = { ..._FaIcons, ...FaIcons6 };

export const ReactIconKinds = ( icon ) => {
	// プレフィックスからアイコン種類を判別
	if ( icon.startsWith( 'Fi' ) && FiIcons[ icon ] !== undefined ) {
		return 'fi';
	} else if ( icon.startsWith( 'Fa' ) && FaIcons[ icon ] !== undefined ) {
		return 'fa';
	} else if ( icon.startsWith( 'Io' ) && IoIcons[ icon ] !== undefined ) {
		return 'io';
	} else if ( icon.startsWith( 'Phosphor_' ) ) {
		return 'phosphor';
	}
	return null;
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
	if ( ReactIconKinds( iconName ) === 'fi' ) {
		return createElement( FiIcons[ iconName ], { size, className, style } );
	} else if ( ReactIconKinds( iconName ) === 'fa' ) {
		return createElement( FaIcons[ iconName ], { size, className } );
	} else if ( ReactIconKinds( iconName ) === 'io' ) {
		return createElement( IoIcons[ iconName ], { size, className } );
	} else if ( ReactIconKinds( iconName ) === 'phosphor' ) {
		const parts = iconName.split( '_' );
		const _iconType = parts[ 1 ];
		const iconNamePart = parts[ 2 ];
		return getSvgHtml( iconNamePart, _iconType );
	}
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
