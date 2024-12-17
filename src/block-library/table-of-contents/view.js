document.addEventListener( 'DOMContentLoaded', () => {
	const entryContent = document.querySelector( '.entry-content' );
	if ( ! entryContent ) {
		console.log( 'entry-content not found' );
		return;
	}

	const tocContainers = document.querySelectorAll( '.contents-outline' );
	if ( tocContainers.length === 0 ) {
		console.log( 'contents-outline not found' );
		return;
	}

	const headings = entryContent.querySelectorAll( 'h2, h3, h4, h5, h6' );
	if ( headings.length === 0 ) {
		console.log( 'No headings found' );
		return;
	}

	const idMap = new Map();

	headings.forEach( ( heading ) => {
		let id =
			heading.id ||
			heading.textContent.trim().toLowerCase().replace( /\s+/g, '-' );

		if ( ! heading.id ) {
			if ( idMap.has( id ) ) {
				let count = idMap.get( id );
				count++;
				idMap.set( id, count );
				id = `${ id }-${ count }`;
			} else {
				idMap.set( id, 1 );
			}

			heading.id = id;
		}
	} );

	tocContainers.forEach( ( tocContainer ) => {
		const tocList = document.createElement( 'ol' );
		tocList.classList.add( 'ol-depth-1' );
		let currentLevel = 2;
		let currentList = tocList;
		let listStack = [ tocList ];

		headings.forEach( ( heading ) => {
			const level = parseInt( heading.tagName.substring( 1 ) );
			const listItem = document.createElement( 'li' );
			const link = document.createElement( 'a' );
			const id = heading.id;

			link.href = `#${ id }`;
			link.textContent = heading.textContent;

			listItem.appendChild( link );

			if ( level > currentLevel ) {
				const newList = document.createElement( 'ol' );
				newList.classList.add( `ol-depth-${ level - 1 }` );
				listStack[ listStack.length - 1 ].lastElementChild.appendChild(
					newList
				);
				listStack.push( newList );
				currentList = newList;
			} else if ( level < currentLevel ) {
				while ( level < currentLevel ) {
					listStack.pop();
					currentList = listStack[ listStack.length - 1 ];
					currentLevel--;
				}
			}

			currentList.appendChild( listItem );
			currentLevel = level;
		} );

		tocContainer.appendChild( tocList );
		console.log( 'Table of contents generated' );
	} );

	// スクロールイベントをリッスンして、現在の見出しに対応する目次項目にactiveクラスを追加
	window.addEventListener( 'scroll', () => {
		let currentHeading = null;

		headings.forEach( ( heading, index ) => {
			const nextHeading = headings[ index + 1 ];
			const rect = heading.getBoundingClientRect();
			const nextRect = nextHeading
				? nextHeading.getBoundingClientRect()
				: { top: Infinity };

			if ( rect.top <= 0 && nextRect.top > 0 ) {
				currentHeading = heading;
			}
		} );

		tocContainers.forEach( ( tocContainer ) => {
			const links = tocContainer.querySelectorAll( 'a' );
			let activeFound = false;
			links.forEach( ( link ) => {
				const listItem = link.parentElement;
				listItem.classList.remove( 'active' );
				if (
					currentHeading &&
					link.getAttribute( 'href' ) === `#${ currentHeading.id }`
				) {
					listItem.classList.add( 'active' );
					activeFound = true;
				}
			} );

			// activeクラスが存在しない場合は最初の要素にactiveクラスを追加
			if ( ! activeFound && links.length > 0 ) {
				links[ 0 ].parentElement.classList.add( 'active' );
			}
		} );
	} );
} );
