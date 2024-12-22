import { handleScroll } from './scroll.js';

export function assignHeadingIds( headings, idMap ) {
	headings.forEach( ( heading ) => {
		let id =
			heading.id ||
			heading.textContent.trim().toLowerCase().replace( /\s+/g, '-' );
		if ( ! heading.id ) {
			idMap.set( id, ( idMap.get( id ) || 0 ) + 1 );
			if ( idMap.get( id ) > 1 ) id += `-${ idMap.get( id ) }`;
			heading.id = id;
		}
	} );
}

export function generateTableOfContents( tocContainers, headings ) {
	tocContainers.forEach( ( tocContainer ) => {
		const tocList = document.createElement( 'ol' );
		tocList.classList.add( 'ol-depth-1' );
		let currentLevel = parseInt( headings[ 0 ].tagName.substring( 1 ) );
		let currentList = tocList;
		const listStack = [ tocList ];

		headings.forEach( ( heading ) => {
			const level = parseInt( heading.tagName.substring( 1 ) );
			const listItem = createListItem( heading );

			if ( level > currentLevel ) {
				const newList = document.createElement( 'ol' );
				newList.classList.add( `ol-depth-${ level }` );
				appendNewList( listStack, newList );
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

		// 目次エリアのスクロールイベントを制御
		// tocContainer.addEventListener( 'wheel', ( event ) => {
		// 	if ( tocContainer.matches( ':hover' ) ) {
		// 		event.preventDefault();
		// 		tocContainer.scrollTop += event.deltaY;
		// 	}
		// } );

		// activeクラスが存在しない場合は最初のliをactiveにする
		const activeItems = tocContainer.querySelectorAll( 'li.active' );
		if ( activeItems.length === 0 ) {
			const firstListItem = tocContainer.querySelector( 'li' );
			if ( firstListItem ) {
				firstListItem.classList.add( 'active' );
			}
		}
	} );
}

function createListItem( heading ) {
	const listItem = document.createElement( 'li' );
	const link = document.createElement( 'a' );
	link.href = `#${ heading.id }`;
	link.textContent = heading.textContent;
	listItem.appendChild( link );
	return listItem;
}

function appendNewList( listStack, newList ) {
	if ( listStack[ listStack.length - 1 ].lastElementChild ) {
		listStack[ listStack.length - 1 ].lastElementChild.appendChild(
			newList
		);
	} else {
		listStack[ listStack.length - 1 ].appendChild( newList );
	}
}

export function setupIntersectionObserver( tocContainers, headings ) {
	const observer = new IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					window.addEventListener( 'scroll', () =>
						handleScroll( headings, tocContainers )
					);
				} else {
					window.removeEventListener( 'scroll', () =>
						handleScroll( headings, tocContainers )
					);
				}
			} );
		},
		{
			root: null,
			threshold: 1,
		}
	);

	tocContainers.forEach( ( tocContainer ) => {
		observer.observe( tocContainer );
	} );
}
