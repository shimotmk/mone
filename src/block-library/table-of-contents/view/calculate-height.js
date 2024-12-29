export const calculateHeight = ( tocContainers ) => {
	tocContainers.forEach( ( tocContainer ) => {
		if ( tocContainer.classList.contains( 'mone-is-scroll-animation' ) ) {
			const stickyParent = tocContainer.closest( '.is-position-sticky' );
			if ( stickyParent ) {
				const stickyParentStyle =
					window.getComputedStyle( stickyParent );
				const paddingTop =
					parseFloat( stickyParentStyle.paddingTop ) || 0;
				const paddingBottom =
					parseFloat( stickyParentStyle.paddingBottom ) || 0;
				const top = parseFloat( stickyParentStyle.top ) || 0;
				const gap = parseFloat( stickyParentStyle.gap ) || 0;

				const otherElementsHeight = Array.from( stickyParent.children )
					.filter( ( child ) => child !== tocContainer )
					.reduce( ( total, child ) => {
						const childStyle = window.getComputedStyle( child );
						const childHeight =
							child.getBoundingClientRect().height;
						const marginTop =
							parseFloat( childStyle.marginTop ) || 0;
						const marginBottom =
							parseFloat( childStyle.marginBottom ) || 0;
						const childBorderTop =
							parseFloat( childStyle.borderTopWidth ) || 0;
						const childBorderBottom =
							parseFloat( childStyle.borderBottomWidth ) || 0;
						return (
							total +
							childHeight +
							marginTop +
							marginBottom +
							gap +
							childBorderTop +
							childBorderBottom
						);
					}, 0 );

				const tocStyle = window.getComputedStyle( tocContainer );
				const tocMarginTop = parseFloat( tocStyle.marginTop ) || 0;
				const tocPaddingTop = parseFloat( tocStyle.paddingTop ) || 0;
				const tocPaddingBottom =
					parseFloat( tocStyle.paddingBottom ) || 0;
				const tocBorderTop = parseFloat( tocStyle.borderTopWidth ) || 0;
				const tocBorderBottom =
					parseFloat( tocStyle.borderBottomWidth ) || 0;

				const availableHeight =
					window.innerHeight -
					paddingTop -
					paddingBottom -
					otherElementsHeight -
					tocMarginTop -
					tocPaddingTop -
					tocPaddingBottom -
					tocBorderTop -
					tocBorderBottom -
					2 * top;
				tocContainer.style.maxHeight = `calc(${ availableHeight }px + ( var(--wp-admin--admin-bar--position-offset, 0px) ) )`;
			}
		}
	} );
};
