import './editor.scss';
import { LicenseKeyForm } from './license';
import { createRoot } from '@wordpress/element';

document.addEventListener( 'DOMContentLoaded', () => {
	const rootElement = document.getElementById( 'mone-activate-admin-wrap' );
	if ( rootElement ) {
		const root = createRoot( rootElement );
		root.render( <LicenseKeyForm /> );
	}
} );
