function init() {
	const youtubeIframe = document.querySelectorAll( 'iframe.mone-lazy-load' );
	for ( let i = 0; i < youtubeIframe.length; i++ ) {
		if ( youtubeIframe[ i ].getAttribute( 'data-src' ) ) {
			youtubeIframe[ i ].setAttribute(
				'src',
				youtubeIframe[ i ].getAttribute( 'data-src' )
			);
		}
	}
}
window.onload = init;
