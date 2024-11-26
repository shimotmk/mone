import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useState, useEffect, useMemo } from '@wordpress/element';

import './style.scss';

/**
 * Override the default block element to include elements styles.
 */
const BlockListBlockPreformatted = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		const { name, attributes, wrapperProps } = props;
		if ( name !== 'core/preformatted' ) {
			return <BlockListBlock { ...props } />;
		}
		const { className } = attributes;
		const nowClassArray = useMemo(
			() => ( className ? className.split( ' ' ) : [] ),
			[ className ]
		);

		const [ addWrapperProps, setAddWrapperProps ] =
			useState( wrapperProps );
		useEffect( () => {
			if (
				nowClassArray.length !== 0 &&
				nowClassArray.includes( 'is-style-mone-pre-scrollable' )
			) {
				setAddWrapperProps( {
					...wrapperProps,
					style: {
						...wrapperProps?.style,
						overflowX: 'auto',
						whiteSpace: 'nowrap',
					},
				} );
			} else {
				setAddWrapperProps( wrapperProps );
			}
		}, [ nowClassArray, wrapperProps ] );

		return (
			<>
				<BlockListBlock { ...props } wrapperProps={ addWrapperProps } />
			</>
		);
	},
	'BlockListBlockPreformatted'
);

addFilter(
	'editor.BlockListBlock',
	'mone/editor/block-list-block/preformatted',
	BlockListBlockPreformatted
);
