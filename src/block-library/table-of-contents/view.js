document.addEventListener( 'DOMContentLoaded', () => {
	const entryContent = document.querySelector( '.entry-content' );
	if ( ! entryContent ) {
		return console.log( 'entry-content not found' );
	}

	const tocContainers = document.querySelectorAll(
		'.wp-block-mone-table-of-contents'
	);
	if ( tocContainers.length === 0 ) {
		return console.log( 'wp-block-mone-table-of-contents not found' );
	}

	const headings = entryContent.querySelectorAll( 'h2, h3, h4, h5, h6' );
	if ( headings.length === 0 ) {
		return console.log( 'No headings found' );
	}

	const idMap = new Map();

	headings.forEach( ( heading ) => {
		let id =
			heading.id ||
			heading.textContent.trim().toLowerCase().replace( /\s+/g, '-' );
		if ( ! heading.id ) {
			idMap.set( id, ( idMap.get( id ) || 0 ) + 1 );
			if ( idMap.get( id ) > 1 ) {
				id += `-${ idMap.get( id ) }`;
			}
			heading.id = id;
		}
	} );

	tocContainers.forEach( ( tocContainer ) => {
		const tocList = document.createElement( 'ol' );
		tocList.classList.add( 'ol-depth-1' );
		let currentLevel = parseInt( headings[ 0 ].tagName.substring( 1 ) ); // 最初の見出しのレベルに設定
		let currentList = tocList;
		const listStack = [ tocList ];

		headings.forEach( ( heading ) => {
			const level = parseInt( heading.tagName.substring( 1 ) );
			const listItem = document.createElement( 'li' );
			const link = document.createElement( 'a' );
			link.href = `#${ heading.id }`;
			link.textContent = heading.textContent;
			listItem.appendChild( link );

			if ( level > currentLevel ) {
				const newList = document.createElement( 'ol' );
				newList.classList.add( `ol-depth-${ level }` ); // 修正: level - 1 から level に変更
				if ( listStack[ listStack.length - 1 ].lastElementChild ) {
					listStack[
						listStack.length - 1
					].lastElementChild.appendChild( newList );
				} else {
					listStack[ listStack.length - 1 ].appendChild( newList );
				}
				listStack.push( newList );
				currentList = newList;
			} else {
				while ( level < currentLevel && listStack.length > 1 ) {
					listStack.pop();
					currentList = listStack[ listStack.length - 1 ];
					currentLevel--;
				}
			}

			if ( currentList ) {
				currentList.appendChild( listItem );
			}
			currentLevel = level;
		} );

		tocContainer.appendChild( tocList );
		console.log( 'Table of contents generated' );
	} );

	window.addEventListener( 'scroll', () => {
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
						tocContainer.classList.contains( 'sidebar' ) &&
						tocContainer.classList.contains( 'has-max-height' ) &&
						window.innerWidth >= 781
					) {
						// listItem.scrollIntoView( {
						// 	behavior: 'smooth',
						// 	block: 'nearest',
						// } );
					}
				}
			} );
			if ( ! activeFound && links.length > 0 ) {
				links[ 0 ].parentElement.classList.add( 'active' );
			}
		} );
	} );
} );
