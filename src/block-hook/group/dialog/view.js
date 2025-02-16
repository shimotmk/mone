/**
 * WordPress dependencies.
 */
import { store, getContext } from '@wordpress/interactivity';

store(
	'mone/dialog-link',
	{
		actions: {
			clickDialogButton() {
				const context = getContext();
				const dialogRef = document.querySelector(
					`dialog${ context.dialogHref }`
				);
				console.log( 'context', context );

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
					dialogRef.close();
					document.body.classList.remove( 'dialog-open' );
				}
			},
			handleKeydown( event ) {
				const context = getContext();
				const dialogRef = document.querySelector(
					`dialog${ context.dialogHref }`
				);

				if ( event.key === 'Escape' ) {
					dialogRef.close();
					document.body.classList.remove( 'dialog-open' );
				}
			},
		},
	},
	{ lock: true }
);
