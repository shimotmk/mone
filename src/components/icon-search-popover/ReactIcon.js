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

export const FaIcons = { ..._FaIcons, ...FaIcons6 };

export const ReactIconKinds = ( icon ) => {
	// プレフィックスからアイコン種類を判別
	if ( icon.startsWith( 'Fi' ) && FiIcons[ icon ] !== undefined ) {
		return 'fi';
	} else if ( icon.startsWith( 'Fa' ) && FaIcons[ icon ] !== undefined ) {
		return 'fa';
	} else if ( icon.startsWith( 'Io' ) && IoIcons[ icon ] !== undefined ) {
		return 'io';
	}
	return null;
};

export const ReactIcon = ( {
	icon,
	className = '',
	size = undefined,
	style = { fill: 'none' },
} ) => {
	if ( ReactIconKinds( icon ) === 'fi' ) {
		return createElement( FiIcons[ icon ], { size, className, style } );
	} else if ( ReactIconKinds( icon ) === 'fa' ) {
		return createElement( FaIcons[ icon ], { size, className } );
	} else if ( ReactIconKinds( icon ) === 'io' ) {
		return createElement( IoIcons[ icon ], { size, className } );
	}
	return null;
};

export const IconExternalLink = ( { icon } ) => {
	const SVG = renderToString( <ReactIcon icon={ icon } /> );
	return 'data:image/svg+xml,' + encodeURIComponent( SVG );
};

export const getReactIcon = ( { icon, className = '', size = undefined } ) => {
	if ( ReactIconKinds( icon ) === 'fi' ) {
		return FiIcons[ icon ], { size, className };
	} else if ( ReactIconKinds( icon ) === 'fa' ) {
		return FaIcons[ icon ], { size, className };
	} else if ( ReactIconKinds( icon ) === 'io' ) {
		return IoIcons[ icon ], { size, className };
	}
	return null;
};

export const createSvgUrl = ( svgString ) => {
	// NOTE: escape関数やunescape関数は非推奨なので注意。
	const encodedSvgString = encodeURIComponent( svgString );
	const svgBase64 = window.btoa( decodeURIComponent( encodedSvgString ) );

	const imageSrc = `data:image/svg+xml;base64,${ svgBase64 }`;
	return imageSrc;
};
