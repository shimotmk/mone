/**
 * WordPress dependencies.
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const forcePageReload = ( href ) => {
	window.location.assign( href );
	return new Promise( () => {} );
};

const focusableSelectors = [
	'a[href]',
	'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
	'select:not([disabled]):not([aria-hidden])',
	'textarea:not([disabled]):not([aria-hidden])',
	'button:not([disabled]):not([aria-hidden])',
	'[contenteditable]',
	'[tabindex]:not([tabindex^="-"])',
];

const { state, actions } = store( 'mone/styles-switcher', {
	state: {
		get isMenuOpen() {
			const context = getContext();
			return (
				Object.values( context?.submenuOpenedBy ?? [] ).filter(
					Boolean
				).length > 0
			);
		},
		get menuOpenedBy() {
			const ctx = getContext();
			return ctx?.submenuOpenedBy ?? [];
		},
	},
	actions: {
		toggleMenuOnClick() {
			const ctx = getContext();
			const { ref } = getElement();
			// Safari won't send focus to the clicked element, so we need to manually place it: https://bugs.webkit.org/show_bug.cgi?id=22261
			if ( window.document.activeElement !== ref ) {
				ref.focus();
			}
			const { menuOpenedBy } = state;
			if ( menuOpenedBy.click || menuOpenedBy.focus ) {
				actions.closeMenu( 'click' );
				actions.closeMenu( 'focus' );
			} else {
				ctx.previousFocus = ref;
				actions.openMenu( 'click' );
			}
		},
		openMenuOnHover() {
			const context = getContext();
			context.isActive = true;
		},
		closeMenuOnHover() {
			const context = getContext();
			context.isActive = false;
		},
		handleMenuFocusout( event ) {
			const { modal } = getContext();
			if (
				event.relatedTarget === null ||
				( ! modal?.contains( event.relatedTarget ) &&
					event.target !== window.document.activeElement )
			) {
				actions.closeMenu( 'click' );
				actions.closeMenu( 'focus' );
			}
		},

		openMenu( menuOpenedOn = 'click' ) {
			const context = getContext();
			context.isActive = true;
			state.menuOpenedBy[ menuOpenedOn ] = true;
		},

		closeMenu( menuClosedOn = 'click' ) {
			const ctx = getContext();
			ctx.isActive = false;
			state.menuOpenedBy[ menuClosedOn ] = false;
			// Check if the menu is still open or not.
			if ( ! state.isMenuOpen ) {
				ctx.previousFocus = null;
			}
		},

		clickDarkStyle() {
			const ctx = getContext();
			state.darkStyles = JSON.parse( ctx.darkStyleSheet );
			if ( ! state.darkStyles ) {
				state.darkStyles = ctx.darkStyleSheet;
				// document.body.classList.add('mone-style-variation-dark');
			} else {
				state.darkStyles = '';
				// document.body.classList.remove('mone-style-variation-dark');
			}
		},

		*navigate( event ) {
			const value = event.target.value;
			if ( value === undefined || value === '' ) {
				const url = new URL( window.location.href );
				url.searchParams.delete( 'style_variation' );
				yield forcePageReload(
					`${ url.pathname }${ url.search }${ url.hash }`
				);
			} else {
				const url = new URL( window.location.href );
				url.searchParams.set( 'style_variation', value );
				yield forcePageReload(
					`${ url.pathname }${ url.search }${ url.hash }`
				);
			}
		},
	},
	callbacks: {
		initMenu() {
			const ctx = getContext();
			const { ref } = getElement();
			if ( state.isMenuOpen ) {
				const focusableElements =
					ref.querySelectorAll( focusableSelectors );
				ctx.modal = ref;
				ctx.firstFocusableElement = focusableElements[ 0 ];
				ctx.lastFocusableElement =
					focusableElements[ focusableElements.length - 1 ];
			}
		},
	},
} );
