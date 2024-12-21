/* global getComputedStyle */

export function handleScroll( headings, tocContainers ) {
	let currentHeading = null;
	const offset =
		parseFloat(
			getComputedStyle( document.documentElement ).getPropertyValue(
				'--wp--style--block-gap'
			)
		) *
			16 +
		1.2 * 16;

	headings.forEach( ( heading, index ) => {
		const nextHeading = headings[ index + 1 ];
		const rect = heading.getBoundingClientRect();
		const nextRect = nextHeading
			? nextHeading.getBoundingClientRect()
			: { top: Infinity };
		if ( rect.top <= offset && nextRect.top > offset ) {
			currentHeading = heading;
		}
	} );

	tocContainers.forEach( ( tocContainer ) => {
		const links = tocContainer.querySelectorAll( 'a' );
		let activeFound = false;
		const tocRect = tocContainer.getBoundingClientRect();

		const isTocFullyVisible =
			tocRect.top >= 0 && tocRect.bottom <= window.innerHeight;

		links.forEach( ( link ) => {
			const listItem = link.parentElement;
			listItem.classList.remove( 'active' );
			if ( listItem.classList.length === 0 ) {
				listItem.removeAttribute( 'class' );
			}
			if (
				currentHeading &&
				link.getAttribute( 'href' ) === `#${ currentHeading.id }`
			) {
				listItem.classList.add( 'active' );
				activeFound = true;
				if (
					isTocFullyVisible &&
					tocContainer.classList.contains( 'sidebar' ) &&
					tocContainer.classList.contains( 'has-max-height' ) &&
					window.innerWidth >= 781
				) {
					listItem.scrollIntoView( { block: 'nearest' } );
				}
			}
		} );
		if ( ! activeFound && links.length > 0 ) {
			links[ 0 ].parentElement.classList.add( 'active' );
		}
	} );
}
