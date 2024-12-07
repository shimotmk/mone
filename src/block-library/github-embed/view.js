import hljs from 'highlight.js';

// ページ内のすべてのコードブロックに対してシンタックスハイライトを適用
document.addEventListener( 'DOMContentLoaded', () => {
	document
		.querySelectorAll( 'pre code.embed-github-code' )
		.forEach( ( block ) => {
			hljs.highlightBlock( block );
		} );
} );
