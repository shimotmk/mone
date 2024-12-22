import {
	assignHeadingIds,
	generateTableOfContents,
	setupIntersectionObserver,
} from './toc.js';
import { hideElementsWithClass } from './hide-element';

document.addEventListener( 'DOMContentLoaded', () => {
	// Get the entry content element
	const entryContent = document.querySelector( '.entry-content' );
	if ( ! entryContent ) {
		hideElementsWithClass( 'mone-toc-none' );
		return;
	}

	// Get the table of contents containers
	const tocContainers = document.querySelectorAll(
		'.wp-block-mone-table-of-contents'
	);
	if ( tocContainers.length === 0 ) {
		hideElementsWithClass( 'mone-toc-none' );
		return;
	}

	// Get all headings in the entry content
	const headings = entryContent.querySelectorAll( 'h2, h3, h4, h5, h6' );
	if ( headings.length === 0 ) {
		hideElementsWithClass( 'mone-toc-none' );
		return;
	}

	const idMap = new Map();
	assignHeadingIds( headings, idMap );
	generateTableOfContents( tocContainers, headings );
	setupIntersectionObserver( tocContainers, headings );
} );
