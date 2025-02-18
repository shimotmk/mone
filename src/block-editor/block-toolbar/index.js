/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { ToolbarDropdownMenu } from '@wordpress/components';
import { Icon } from '@wordpress/icons';

import { blockCategoryIcon } from '../../icons';
import clsx from 'clsx';

const POPOVER_PROPS = {
	placement: 'bottom-start',
};

export const BlockEditBlockToolbar = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const controlLists = applyFilters(
			'mone.BlockToolbarDropdownMenu',
			[],
			props
		);

		if ( controlLists.length === 0 ) {
			return <BlockEdit { ...props } />;
		}

		const hasActiveControl = controlLists.some(
			( control ) => control.isActive
		);

		return (
			<>
				<BlockEdit { ...props } />
				<BlockControls group="other">
					<ToolbarDropdownMenu
						icon={ <Icon icon={ blockCategoryIcon } /> }
						label={ __( 'Mone Menu', 'mone' ) }
						controls={ controlLists }
						popoverProps={ POPOVER_PROPS }
						className={ clsx( 'mone-block-toolbar-dropdown-menu', {
							'is-active': hasActiveControl,
						} ) }
					/>
				</BlockControls>
			</>
		);
	}
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/block-toolbar',
	BlockEditBlockToolbar
);
