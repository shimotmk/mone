/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { BlockFormatControls } from '@wordpress/block-editor';
import { registerFormatType } from '@wordpress/rich-text';
import {
	ToolbarItem,
	Slot,
	DropdownMenu,
	ToolbarGroup,
} from '@wordpress/components';
import { Icon } from '@wordpress/icons';

import { blockCategoryIcon } from '../../icons';

const POPOVER_PROPS = {
	placement: 'bottom-start',
};

const BlockToolbar = () => {
	return (
		<BlockFormatControls>
			<div className="block-editor-format-toolbar mone-format-toolbar">
				<ToolbarGroup>
					<Slot name={ `RichText.ToolbarControls.moneMenu` }>
						{ ( fills ) => {
							if ( ! fills.length ) {
								return null;
							}

							const allProps = fills.map(
								( [ { props } ] ) => props
							);
							const hasActive = allProps.some(
								( { isActive } ) => isActive
							);

							const order = [
								__( 'Icon', 'mone' ),
								__( 'Set Dialog', 'mone' ),
								__( 'Dialog', 'mone' ),
								__( 'Select Dialog', 'mone' ),
								__( 'Delete Dialog', 'mone' ),
								__( 'Inline Font Size', 'mone' ),
								__( 'Text Gradient', 'mone' ),
								__( 'Background Gradient', 'mone' ),
								__( 'Stroke', 'mone' ),
								__( 'Bold', 'mone' ),
								__( 'Reset Formatting', 'mone' ),
								__( 'Remove Format', 'mone' ),
							];
							const sortedFills = fills.sort( ( a, b ) => {
								const titleA = a[ 0 ].props.title;
								const titleB = b[ 0 ].props.title;
								return (
									order.indexOf( titleA ) -
									order.indexOf( titleB )
								);
							} );
							const controls = sortedFills.map(
								( [ { props } ] ) => props
							);

							return (
								<ToolbarItem>
									{ ( toggleProps ) => (
										<DropdownMenu
											icon={
												<Icon
													icon={ blockCategoryIcon }
												/>
											}
											label={ __( 'Mone Menu', 'mone' ) }
											toggleProps={ {
												...toggleProps,
												className: clsx(
													toggleProps.className,
													{ 'is-pressed': hasActive }
												),
												description: __(
													'Displays more mone tools'
												),
											} }
											controls={ controls }
											popoverProps={ POPOVER_PROPS }
										/>
									) }
								</ToolbarItem>
							);
						} }
					</Slot>
				</ToolbarGroup>
			</div>
		</BlockFormatControls>
	);
};

registerFormatType( 'mone/block-toolbar', {
	title: __( 'Block Toolbar', 'mone' ),
	tagName: 'block-toolbar',
	className: null,
	edit: BlockToolbar,
} );
