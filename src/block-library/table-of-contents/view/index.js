import {
	assignHeadingIds,
	generateTableOfContents,
	setupIntersectionObserver,
} from './toc.js';

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
	assignHeadingIds( headings, idMap );
	generateTableOfContents( tocContainers, headings );
	setupIntersectionObserver( tocContainers, headings );
} );
