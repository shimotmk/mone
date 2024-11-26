/**
 * WordPress dependencies
 */
import { getBlockVariations } from '@wordpress/blocks';
import domReady from '@wordpress/dom-ready';

domReady( () => {
	const registerEmbedBlocks = [
		'flickr',
		'cloudup',
		'imgur',
		'kickstarter',
		'reddit',
		'issuu',
		'mixcloud',
		'scribd',
		'smugmug',
		'crowdsignal',
		'reverbnation',
		'reverbnation',
		'pocket-casts',
		'animoto',
		'screencast',
		'ted',
		'videopress',
		'bluesky',
		'wolfram-cloud',
		'wordpress-tv',
		'tumblr',
	];
	getBlockVariations( 'core/embed' )?.forEach( ( block ) => {
		if ( registerEmbedBlocks.includes( block.name ) ) {
			// console.log("block", block);
			// インサーターには表示させない
			block.scope = [ 'block' ];
		}
	} );
} );
