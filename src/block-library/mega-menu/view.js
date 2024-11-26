import { store, getContext, getElement } from '@wordpress/interactivity';

const { state, actions } = store( 'mone/mega-menu', {
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
		toggleMenu( menuOpenedOn = 'click' ) {
			const context = getContext();
			const { ref } = getElement();
			const target = ref.closest( '.wp-block-mone-mega-menu' );

			state.menuOpenedBy[ menuOpenedOn ] = true;

			if ( context.isMenuOpen ) {
				actions.closeMenu();
			} else {
				context.isMenuOpen = true;
			}

			let { left: offsetLeft } = target.getBoundingClientRect();
			offsetLeft = -offsetLeft;
			const clientWidth = document.documentElement.clientWidth;

			context.offsetLeft = `${ offsetLeft }px`;
			context.clientWidth = `${ clientWidth }px`;
		},
		closeMenu( menuClosedOn = 'click' ) {
			const context = getContext();
			context.isMenuOpen = false;
			state.menuOpenedBy[ menuClosedOn ] = false;
		},
		openMenuOnHover() {
			actions.toggleMenu( 'hover' );
		},
		closeMenuOnHover() {
			actions.closeMenu( 'hover' );
		},
	},
	callbacks: {
		setMegaMenuStyles() {
			const context = getContext();
			const { ref } = getElement();
			const target = ref.closest( '.wp-block-mone-mega-menu' );

			let { left: offsetLeft } = target.getBoundingClientRect();
			offsetLeft = -offsetLeft;
			const clientWidth = document.documentElement.clientWidth;

			context.offsetLeft = `${ offsetLeft }px`;
			context.clientWidth = `${ clientWidth }px`;
		},
	},
} );
