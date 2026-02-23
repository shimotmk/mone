import { store, getContext, getElement } from '@wordpress/interactivity';

store( 'mone/post-featured-image-youtube-video', {
	state: {
		get isPlaying() {
			return getContext().isPlaying;
		},
	},

	actions: {
		initPlayer: () => {
			const context = getContext();
			window.addEventListener( 'message', ( event ) => {
				if ( event.origin !== 'https://www.youtube.com' ) {
					return;
				}
				try {
					const data = JSON.parse( event.data );
					// YouTube側が受け入れ可能になった合図
					if (
						data.event === 'onReady' ||
						( data.info && data.info.playerState !== undefined )
					) {
						context.isReady = true;
					}
				} catch ( e ) {}
			} );
		},

		playVideo: () => {
			const context = getContext();
			const { ref } = getElement();
			const iframe = ref.querySelector( 'iframe' );

			if ( context.leaveTimeout ) {
				clearTimeout( context.leaveTimeout );
			}

			context.enterTimeout = setTimeout( () => {
				context.isPlaying = true;

				if ( iframe && iframe.contentWindow ) {
					const handshake = JSON.stringify( {
						event: 'listening',
						id: context.uniqueId,
					} );
					iframe.contentWindow.postMessage( handshake, '*' );

					const playCommand = JSON.stringify( {
						event: 'command',
						func: 'playVideo',
						args: '',
					} );

					// 送信
					iframe.contentWindow.postMessage( playCommand, '*' );

					// 少し遅れて再送 リロード直後対策
					setTimeout( () => {
						if ( context.isPlaying ) {
							iframe.contentWindow.postMessage(
								playCommand,
								'*'
							);
						}
					}, 200 );
				}
			}, 300 );
		},

		pauseVideo: () => {
			const context = getContext();
			const { ref } = getElement();
			const iframe = ref.querySelector( 'iframe' );

			if ( context.enterTimeout ) {
				clearTimeout( context.enterTimeout );
			}

			context.leaveTimeout = setTimeout( () => {
				context.isPlaying = false;
				if ( iframe && iframe.contentWindow ) {
					iframe.contentWindow.postMessage(
						JSON.stringify( {
							event: 'command',
							func: 'pauseVideo',
							args: '',
						} ),
						'*'
					);
				}
			}, 200 );
		},
	},
} );
