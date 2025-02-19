/**
 * WordPress dependencies.
 */
import { store, getContext } from '@wordpress/interactivity';

store(
	'mone/dialog-link',
	{
		actions: {
			clickDialogLink() {
				const context = getContext();
				const dialogRef = document.querySelector(
					`dialog${ context.dialogHref }`
				);

				// URLのhrefのIDを削除
				const url = new URL( window.location );
				url.hash = '';
				window.history.replaceState(
					null,
					document.title,
					url.toString()
				);

				if ( dialogRef ) {
					if ( dialogRef.open ) {
						dialogRef.close();
						document.body.classList.remove( 'dialog-open' );
					} else {
						dialogRef.showModal();
						document.body.classList.add( 'dialog-open' );
					}
				}
			},
		},
	},
	{ lock: true }
);

function closeDialog( dialogRef ) {
	dialogRef.classList.add( 'closing' );

	setTimeout( () => {
		document.body.classList.remove( 'dialog-open' );
		dialogRef.close();
		dialogRef.classList.remove( 'closing' );
		dialogRef.removeAttribute( 'open' );
	}, 450 );
}

store(
	'mone/dialog-content',
	{
		actions: {
			closeDialogArea( event ) {
				const context = getContext();
				const dialogRef = document.querySelector(
					`dialog${ context.dialogHref }`
				);

				if ( event.target.closest( '.dialog_input_area' ) === null ) {
					closeDialog( dialogRef );
				}
			},
			handleKeydown( event ) {
				const context = getContext();
				const dialogRef = document.querySelector(
					`dialog${ context.dialogHref }`
				);

				if ( event.key === 'Escape' ) {
					closeDialog( dialogRef );
				}
			},
		},
	},
	{ lock: true }
);
