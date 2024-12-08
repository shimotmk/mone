import hljs from 'highlight.js';

document.addEventListener( 'DOMContentLoaded', () => {
	document
		.querySelectorAll( 'pre code.embed-github-code' )
		.forEach( ( block ) => {
			hljs.highlightBlock( block );
		} );
} );
