import satori from 'satori';
import { Default } from './template/default';
import { DefaultTwo } from './template/default-two';

export const loadImage = ( img ) => {
	return new Promise( ( resolve ) => ( img.onload = resolve ) );
};

export const promiseReturn = ( x ) => {
	return Promise.resolve( x );
};

export const convertImageToBlob = async ( base64Image ) => {
	// eslint-disable-next-line no-undef
	const image = new Image();
	const imageData = await promiseReturn( base64Image );
	image.src = imageData;
	await loadImage( image );

	const canvas = document.createElement( 'canvas' );
	canvas.width = image.width;
	canvas.height = image.height;

	const ctx = canvas.getContext( '2d' );
	if ( ! ctx ) {
		return;
	}
	ctx.drawImage( image, 0, 0 );

	return new Promise( ( resolve ) => {
		canvas.toBlob( ( blob ) => {
			if ( blob ) {
				resolve( blob );
			}
		}, 'image/png' );
	} );
};

export const svgToPngURL = ( svg ) =>
	new Promise( ( resolve, reject ) => {
		// eslint-disable-next-line no-undef
		const image = new Image();
		image.onload = () => {
			const canvas = document.createElement( 'canvas' );
			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;
			const context = canvas.getContext( '2d' );
			context?.drawImage( image, 0, 0 );
			resolve( canvas.toDataURL( 'image/png' ) );
			URL.revokeObjectURL( image.src );
		};
		image.onerror = ( e ) => {
			reject( e );
			URL.revokeObjectURL( image.src );
		};
		image.src = URL.createObjectURL(
			new Blob( [ svg ], { type: 'image/svg+xml' } )
		);
	} );

export const fetchFont = async ( currentTheme ) => {
	const response = await fetch(
		`${ currentTheme }/assets/fonts/NotoSansJP-Medium-500.ttf`
	);
	return response.arrayBuffer();
};

export const generateSvg = async (
	Component,
	props,
	fontData,
	debug = false
) => {
	if ( typeof Component !== 'function' ) {
		// eslint-disable-next-line no-console
		console.error( 'Invalid component type' );
	}
	return satori( <Component { ...props } />, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: 'NotoSans',
				data: fontData,
				style: 'normal',
			},
		],
		debug,
	} );
};

let hasErrorOccurredSatori = false;

function logErrorOnceSatori( message ) {
	if ( ! hasErrorOccurredSatori ) {
		// eslint-disable-next-line no-console
		console.error( message );
		hasErrorOccurredSatori = true;
	}
}

export const generateImageList = async ( props ) => {
	const {
		postTitle,
		siteTitle,
		siteLogoUrl,
		authorName,
		authorIconUrl,
		currentTheme,
		colorSet,
	} = props;

	const svgList = [];

	try {
		const fontData = await fetchFont( currentTheme );
		const contentContrastColor = colorSet?.find(
			( color ) => color.slug === 'content-contrast'
		)?.color;
		const contentBgColor = colorSet?.find(
			( color ) => color.slug === 'content-bg'
		)?.color;
		const keyColor = colorSet?.find(
			( color ) => color.slug === 'key'
		)?.color;
		const keyTwoColor = colorSet?.find(
			( color ) => color.slug === 'key-2'
		)?.color;

		const svgProps = {
			postTitle,
			siteTitle,
			siteLogoUrl,
			authorName,
			authorIconUrl,
			keyColor,
			keyTwoColor,
			contentBgColor,
			contentContrastColor,
		};

		try {
			const DefaultSvg = await generateSvg( Default, svgProps, fontData );
			svgList.push( {
				name: 'Default',
				svg: DefaultSvg,
			} );
		} catch ( error ) {
			logErrorOnceSatori(
				'Error generating Default SVG: ' + error.message
			);
		}

		const svgProps2 = {
			postTitle,
			siteTitle,
			siteLogoUrl,
			authorName,
			authorIconUrl,
			backgroundColor: contentBgColor,
			color: contentContrastColor,
		};
		try {
			const DefaultTwoSvg = await generateSvg(
				DefaultTwo,
				svgProps2,
				fontData
			);
			svgList.push( {
				name: 'DefaultTwo',
				svg: DefaultTwoSvg,
			} );
		} catch ( error ) {
			logErrorOnceSatori(
				'Error generating DefaultTwo SVG: ' + error.message
			);
		}
	} catch ( error ) {
		logErrorOnceSatori( 'Error generating image list: ' + error );
	}

	return svgList;
};
