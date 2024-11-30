export const isHexColor = ( color ) =>
	typeof color === 'string' && color.startsWith( '#' ) ? true : false;
