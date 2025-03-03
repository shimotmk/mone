/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	FontSizePicker,
} from '@wordpress/components';
import {
	InspectorControls,
	HeightControl,
	useSettings,
} from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';
import { existsClassName } from '../../utils-func/class-name';
import './variation';
import './style.scss';

const moneClassName = 'mone-separator';

export function registerBlockTypeSeparator( settings, name ) {
	if ( name !== 'core/separator' ) {
		return settings;
	}

	settings.supports = {
		...settings.supports,
		__experimentalBorder: {
			radius: true,
			color: false,
			width: false,
			style: true,
			__experimentalDefaultControls: {
				radius: true,
				color: false,
				width: false,
				style: true,
			},
		},
	};

	settings.attributes = {
		...settings.attributes,
		moneSeparatorHeight: {
			type: 'string',
		},
		moneSeparatorWidth: {
			type: 'string',
		},
		moneSeparatorSize: {
			type: 'string',
		},
	};

	return settings;
}

export const blockEditSeparator = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;

		if ( name !== 'core/separator' ) {
			return <BlockEdit { ...props } />;
		}
		const {
			moneSeparatorHeight,
			moneSeparatorWidth,
			moneSeparatorSize,
			className,
			align,
		} = attributes;
		const [ fontSizes ] = useSettings( 'typography.fontSizes' );

		if ( ! existsClassName( className, moneClassName ) ) {
			return <BlockEdit { ...props } />;
		}

		useEffect( () => {
			if ( align === 'full' || align === 'wide' ) {
				setAttributes( {
					moneSeparatorWidth: undefined,
				} );
			}
		}, [ align, setAttributes ] );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="settings">
					<ToolsPanel
						label={ __( 'Settings' ) }
						resetAll={ () =>
							setAttributes( {
								moneSeparatorHeight: undefined,
								moneSeparatorWidth: undefined,
							} )
						}
						dropdownMenuProps={ useToolsPanelDropdownMenuProps() }
					>
						{ ! existsClassName( className, 'is-style-dots' ) && (
							<>
								<ToolsPanelItem
									label={ __( 'Height', 'mone' ) }
									isShownByDefault
									hasValue={ () => !! moneSeparatorHeight }
									onDeselect={ () => {
										setAttributes( {
											moneSeparatorHeight: undefined,
										} );
									} }
								>
									<HeightControl
										label={ __( 'Height', 'mone' ) }
										value={ moneSeparatorHeight || '' }
										onChange={ ( value ) => {
											setAttributes( {
												moneSeparatorHeight: value,
											} );
										} }
									/>
								</ToolsPanelItem>
								<ToolsPanelItem
									label={ __( 'Width', 'mone' ) }
									isShownByDefault
									hasValue={ () => !! moneSeparatorWidth }
									onDeselect={ () => {
										setAttributes( {
											moneSeparatorWidth: undefined,
										} );
									} }
								>
									<HeightControl
										label={ __( 'Width', 'mone' ) }
										value={ moneSeparatorWidth || '' }
										onChange={ ( value ) => {
											setAttributes( {
												moneSeparatorWidth: value,
											} );
										} }
									/>
								</ToolsPanelItem>
							</>
						) }
						{ existsClassName( className, 'is-style-dots' ) && (
							<ToolsPanelItem
								label={ __( 'Size', 'mone' ) }
								isShownByDefault
								hasValue={ () => !! moneSeparatorSize }
								onDeselect={ () => {
									setAttributes( {
										moneSeparatorSize: undefined,
									} );
								} }
							>
								<FontSizePicker
									fontSizes={ fontSizes }
									value={ moneSeparatorSize }
									onChange={ ( value ) => {
										setAttributes( {
											moneSeparatorSize: value,
										} );
									} }
									withReset={ false }
									units={ [
										'%',
										'px',
										'em',
										'rem',
										'vw',
										'vh',
									] }
								/>
							</ToolsPanelItem>
						) }
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	}
);

/**
 * Override the default block element to include elements styles.
 */
const blockListBlockSeparator = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		const { name, attributes, wrapperProps } = props;
		if ( name !== 'core/separator' ) {
			return <BlockListBlock { ...props } />;
		}
		const {
			className,
			moneSeparatorHeight,
			moneSeparatorWidth,
			moneSeparatorSize,
			gradient,
		} = attributes;

		const separatorGradientColor = gradient
			? `var(--wp--preset--gradient--${ gradient })`
			: attributes.style?.color?.gradient || '';

		const extraStyle = {
			...( ! existsClassName( className, 'is-style-dots' ) && {
				height: moneSeparatorHeight || '1px',
				width: moneSeparatorWidth,
				background: separatorGradientColor,
			} ),
			...( existsClassName( className, 'is-style-dots' ) && {
				fontSize: moneSeparatorSize,
				'--the-before-gradient-color': separatorGradientColor,
			} ),
		};

		const blockWrapperProps = {
			...wrapperProps,
			style: {
				...( wrapperProps && { ...wrapperProps.style } ),
				...( existsClassName( className, moneClassName ) &&
					extraStyle && { ...extraStyle } ),
			},
		};

		return (
			<>
				<BlockListBlock
					{ ...props }
					wrapperProps={ blockWrapperProps }
				/>
			</>
		);
	}
);

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/separator',
	registerBlockTypeSeparator
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/separator',
	blockEditSeparator
);

addFilter(
	'editor.BlockListBlock',
	'mone/editor/block-list-block/separator',
	blockListBlockSeparator
);
