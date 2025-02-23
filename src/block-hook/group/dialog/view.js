/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { state } = store(
	'mone/dialog-trigger',
	{
		state: {
			get dialogButtonRight() {
				const { dialogId } = getContext();
				return state.metadata[ dialogId ].dialogButtonRight;
			},
			get dialogButtonTop() {
				const { dialogId } = getContext();
				return state.metadata[ dialogId ].dialogButtonTop;
			},
		},
		actions: {
			clickDialogTrigger() {
				const context = getContext();
				const dialogRef = document.querySelector(
					`dialog${ context.dialogId }`
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
		callbacks: {
			setButtonStyles() {
				const { dialogId } = getContext();
				const { ref } = getElement();

				state.metadata[ dialogId ].dialogRef = ref;
				state.metadata[ dialogId ].currentSrc = ref.currentSrc;

				const {
					naturalWidth,
					naturalHeight,
					offsetWidth,
					offsetHeight,
				} = ref;

				// If the dialog isn't loaded yet, it can't calculate where the button
				// should be.
				if ( naturalWidth === 0 || naturalHeight === 0 ) {
					return;
				}

				const figure = ref.parentElement;
				const figureWidth = ref.parentElement.clientWidth;

				// It needs special handling for the height because a caption will cause
				// the figure to be taller than the dialog, which means it needs to
				// account for that when calculating the placement of the button in the
				// top right corner of the dialog.
				let figureHeight = ref.parentElement.clientHeight;
				const caption = figure.querySelector( 'figcaption' );
				if ( caption ) {
					const captionComputedStyle =
						window.getComputedStyle( caption );
					if (
						! [ 'absolute', 'fixed' ].includes(
							captionComputedStyle.position
						)
					) {
						figureHeight =
							figureHeight -
							caption.offsetHeight -
							parseFloat( captionComputedStyle.marginTop ) -
							parseFloat( captionComputedStyle.marginBottom );
					}
				}

				const buttonOffsetTop = figureHeight - offsetHeight;
				const buttonOffsetRight = figureWidth - offsetWidth;

				let dialogButtonTop = buttonOffsetTop + 16;
				let dialogButtonRight = buttonOffsetRight + 16;

				// In the case of an dialog with object-fit: contain, the size of the
				// <img> element can be larger than the dialog itself, so it needs to
				// calculate where to place the button.
				if ( state.metadata[ dialogId ].scaleAttr === 'contain' ) {
					// Natural ratio of the dialog.
					const naturalRatio = naturalWidth / naturalHeight;
					// Offset ratio of the dialog.
					const offsetRatio = offsetWidth / offsetHeight;

					if ( naturalRatio >= offsetRatio ) {
						// If it reaches the width first, it keeps the width and compute the
						// height.
						const referenceHeight = offsetWidth / naturalRatio;
						dialogButtonTop =
							( offsetHeight - referenceHeight ) / 2 +
							buttonOffsetTop +
							16;
						dialogButtonRight = buttonOffsetRight + 16;
					} else {
						// If it reaches the height first, it keeps the height and compute
						// the width.
						const referenceWidth = offsetHeight * naturalRatio;
						dialogButtonTop = buttonOffsetTop + 16;
						dialogButtonRight =
							( offsetWidth - referenceWidth ) / 2 +
							buttonOffsetRight +
							16;
					}
				}

				state.metadata[ dialogId ].dialogButtonTop = dialogButtonTop;
				state.metadata[ dialogId ].dialogButtonRight =
					dialogButtonRight;
			},
			initTriggerButton() {
				const { dialogId } = getContext();
				const { ref } = getElement();
				state.metadata[ dialogId ].buttonRef = ref;
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
					`dialog${ context.dialogId }`
				);

				if (
					event.target.closest( '.mone-dialog-container-content' ) ===
					null
				) {
					closeDialog( dialogRef );
				}
			},
			handleKeydown( event ) {
				const context = getContext();
				const dialogRef = document.querySelector(
					`dialog${ context.dialogId }`
				);

				if ( event.key === 'Tab' ) {
					event.preventDefault();
					const { ref } = getElement();
					ref.querySelector( 'button' ).focus();
				}

				if ( event.key === 'Escape' ) {
					closeDialog( dialogRef );
				}
			},
			closeDialogById() {
				const context = getContext();
				const dialogRef = document.querySelector(
					`dialog${ context.dialogId }`
				);
				closeDialog( dialogRef );
			},
		},
	},
	{ lock: true }
);
