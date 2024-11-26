/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';
import {
	store as richTextStore,
	unregisterFormatType,
} from '@wordpress/rich-text';
import { select } from '@wordpress/data';

domReady( () => {
	if ( select( richTextStore ).getFormatType( 'core/bold' ) ) {
		unregisterFormatType( 'core/bold' );
	}
} );
