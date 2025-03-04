import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	store as blockEditorStore,
	InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { template as TEMPLATE } from './template.js';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

const ALLOWED_BLOCKS = [ 'mone/styles-switcher-item' ];

const SvgIcon = ( { className } ) => (
	<svg
		className={ clsx( className, 'mone-styles-switcher-arrow' ) }
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M7 14.5l5-5 5 5"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { openDropdownOnClick, isToggle } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const { hasSelection, hasTwoChildBlocks } = useSelect(
		( select ) => {
			const { isBlockSelected, hasSelectedInnerBlock, getBlockOrder } =
				select( blockEditorStore );

			return {
				hasSelection:
					hasSelectedInnerBlock( clientId, true ) ||
					isBlockSelected( clientId ),
				hasTwoChildBlocks: getBlockOrder( clientId ).length === 2,
			};
		},
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: clsx( 'mone-styles-switcher', {
			'mone-dropdown-switcher': ! isToggle,
			'mone-toggle-switcher': isToggle,
			active: hasSelection,
		} ),
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		templateInsertUpdatesSelection: true,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Display', 'mone' ) }
					resetAll={ () => {
						setAttributes( {
							isToggle: undefined,
							openDropdownOnClick: undefined,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					{ hasTwoChildBlocks && (
						<ToolsPanelItem
							label={ __( 'isToggle', 'mone' ) }
							isShownByDefault
							hasValue={ () => !! isToggle }
							onDeselect={ () =>
								setAttributes( {
									isToggle: undefined,
								} )
							}
						>
							<ToggleControl
								__nextHasNoMarginBottom
								checked={ isToggle }
								onChange={ ( value ) => {
									setAttributes( {
										isToggle: value,
									} );
								} }
								label={ __( 'isToggle', 'mone' ) }
							/>
						</ToolsPanelItem>
					) }
					<ToolsPanelItem
						label={ __( 'Open on click' ) }
						isShownByDefault
						hasValue={ () => !! openDropdownOnClick }
						onDeselect={ () =>
							setAttributes( {
								openDropdownOnClick: undefined,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							checked={ openDropdownOnClick }
							onChange={ ( value ) => {
								setAttributes( {
									openDropdownOnClick: value,
								} );
							} }
							label={ __( 'Open on click' ) }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div { ...innerBlocksProps }>
				<div className="mone-styles-switcher-title">
					{ ! isToggle && (
						<>
							<div>{ __( 'Defaults', 'mone' ) }</div>
							<SvgIcon
								className={ clsx( {
									active: hasSelection,
									rotated: hasSelection,
								} ) }
							/>
						</>
					) }
				</div>
				<ul className="dropdown">{ innerBlocksProps.children }</ul>
			</div>
		</>
	);
}
