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
	existsClassName,
	toggleClass,
	deleteClassName,
	deleteClass,
} from '../../utils-func/class-name/classAttribute.js';
import {
	alignCenter,
	alignRight,
	alignLeft,
	alignOneLinerCenter,
} from '../../icons';

export const blockEditCaption = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;
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
		const captionAllClasses = [
			'mone-caption-left',
			'mone-caption-center',
			'mone-caption-right',
			'mone-caption-one-line-center',
		];

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
						dropdownMenuProps={ useToolsPanelDropdownMenuProps() }
					>
						{ ( ! emptyCaption || ! emptyCitation ) && (
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
										[
											'left',
											'center',
											'one-line-center',
											'right',
										].find( ( pos ) =>
											existsClassName(
												className,
												`mone-caption-${ pos }`
											)
										) || undefined
									}
									onChange={ ( newValue ) => {
										const _className = deleteClassName(
											captionAllClasses,
											className
										);
										const newClass = newValue
											? `mone-caption-${ newValue }`
											: '';
										toggleClass(
											newClass,
											_className,
											setAttributes
										);
									} }
								>
									<ToggleGroupControlOptionIcon
										label={ __( 'Left', 'mone' ) }
										icon={ alignLeft }
										value="left"
									/>
									<ToggleGroupControlOptionIcon
										label={ __( 'Center', 'mone' ) }
										icon={ alignCenter }
										value="center"
									/>
									<ToggleGroupControlOptionIcon
										label={ __(
											'One line text center',
											'mone'
										) }
										icon={ alignOneLinerCenter }
										value="one-line-center"
									/>
									<ToggleGroupControlOptionIcon
										label={ __( 'Right', 'mone' ) }
										icon={ alignRight }
										value="right"
									/>
								</ToggleGroupControl>
							</ToolsPanelItem>
						) }
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
