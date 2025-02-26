/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import { InspectorControls, RichText } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { hasBlockSupport } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';
import {
	toggleClass,
	deleteClass,
} from '../../utils-func/class-name/classAttribute.js';
import { deleteClassName, existsClassName } from '../../utils-func/class-name';
import {
	alignCenter,
	alignRight,
	alignLeft,
	alignOneLinerCenter,
} from '../../icons';

export const blockEditCaption = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		if ( ! name.startsWith( 'core/' ) ) {
			return <BlockEdit { ...props } />;
		}

		const hasSupportCustomClassName = hasBlockSupport(
			name,
			'customClassName',
			true
		);
		if ( ! hasSupportCustomClassName ) {
			return <BlockEdit { ...props } />;
		}

		const supportBlockNameLists = [
			'core/audio',
			'core/embed',
			'core/gallery',
			'core/image',
			'core/quote',
			'core/table',
			'core/video',
		];

		if ( ! supportBlockNameLists.includes( name ) ) {
			return <BlockEdit { ...props } />;
		}

		const { className, caption = '', citation = '' } = attributes;
		const emptyCaption = RichText.isEmpty( caption );
		const emptyCitation = RichText.isEmpty( citation );
		if ( emptyCaption && emptyCitation ) {
			return <BlockEdit { ...props } />;
		}

		const captionAllClasses = [
			'mone-caption-left',
			'mone-caption-center',
			'mone-caption-right',
			'mone-caption-one-line-center',
		];

		const basePositions = [
			{ value: 'left', label: __( 'Left', 'mone' ), icon: alignLeft },
			{
				value: 'center',
				label: __( 'Center', 'mone' ),
				icon: alignCenter,
			},
			{ value: 'right', label: __( 'Right', 'mone' ), icon: alignRight },
		];

		const captionPositions =
			name !== 'core/gallery'
				? [
						...basePositions,
						{
							value: 'one-line-center',
							label: __( 'One line text center', 'mone' ),
							icon: alignOneLinerCenter,
						},
				  ]
				: basePositions;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="settings">
					<ToolsPanel
						label={ __( 'Settings' ) }
						resetAll={ () => {
							deleteClass(
								captionAllClasses,
								className,
								setAttributes
							);
						} }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							label={ __( 'Caption Position', 'mone' ) }
							isShownByDefault
							hasValue={ () =>
								!! existsClassName(
									className,
									captionAllClasses
								)
							}
							onDeselect={ () => {
								deleteClass(
									captionAllClasses,
									className,
									setAttributes
								);
							} }
						>
							<ToggleGroupControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								isDeselectable
								label={ __( 'Caption Position', 'mone' ) }
								value={
									captionPositions.find( ( { value } ) =>
										existsClassName(
											className,
											`mone-caption-${ value }`
										)
									)?.value
								}
								onChange={ ( value ) => {
									const newClassName = value
										? `mone-caption-${ value }`
										: '';
									toggleClass(
										newClassName,
										deleteClassName(
											captionAllClasses,
											className
										),
										setAttributes
									);
								} }
							>
								{ captionPositions.map(
									( { value, label, icon } ) => (
										<ToggleGroupControlOptionIcon
											key={ value }
											value={ value }
											label={ label }
											icon={ icon }
										/>
									)
								) }
							</ToggleGroupControl>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	}
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/caption',
	blockEditCaption
);
