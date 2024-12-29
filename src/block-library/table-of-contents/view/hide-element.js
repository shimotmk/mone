export function hideElementsWithClass( className ) {
	document.querySelectorAll( `.${ className }` ).forEach( ( element ) => {
		element.style.display = 'none';
	} );
}
