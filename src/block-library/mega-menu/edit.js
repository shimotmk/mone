import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	ComboboxControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	Button,
	ToggleControl,
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { addQueryArgs, safeDecodeURI } from '@wordpress/url';

import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

export default function MegaMenuEdit( props ) {
	const { attributes, setAttributes } = props;
	const { label, menuSlug, megaMenuType, url, title, rel, linkTarget } =
		attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const blockProps = useBlockProps( {
		className: clsx( 'mone-mega-menu' ),
	} );

	const { hasResolved, records } = useEntityRecords(
		'postType',
		'wp_template_part',
		{ per_page: -1 }
	);

	let menuOptions = [];
	if ( hasResolved ) {
		menuOptions = records
			.filter( ( item ) => item.area === 'menu' )
			.map( ( item ) => ( {
				id: item.id,
				label: item.title.rendered,
				value: item.slug,
			} ) );
	}

	const editPartsUrl = ( postId ) => {
		return addQueryArgs( 'site-editor.php', {
			postId,
			postType: 'wp_template_part',
			canvas: 'edit',
		} );
	};

	const createPartsUrl = addQueryArgs( 'site-editor.php', {
		categoryId: 'menu',
		postType: 'wp_template_part',
	} );

	const getMenuOptionDetails = ( _menuSlug, _menuOptions ) => {
		const option = _menuOptions.find(
			( item ) => item.value === _menuSlug
		);
		if ( option ) {
			return {
				id: option.id,
				label: option.label,
			};
		}
		return null;
	};

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'mone' ) }
					resetAll={ () => {
						setAttributes( {
							menuSlug: undefined,
							megaMenuType: undefined,
							url: undefined,
							linkTarget: '_self',
							rel: undefined,
							title: undefined,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Menu Template', 'mone' ) }
						isShownByDefault
						hasValue={ () => !! menuSlug }
						onDeselect={ () =>
							setAttributes( {
								menuSlug: undefined,
							} )
						}
					>
						<ComboboxControl
							label={ __( 'Menu Template', 'mone' ) }
							value={ menuSlug || [] }
							options={ menuOptions }
							onChange={ ( slugValue ) =>
								setAttributes( { menuSlug: slugValue } )
							}
						/>
						{ menuSlug && (
							<Button
								variant="secondary"
								href={ editPartsUrl(
									getMenuOptionDetails(
										menuSlug,
										menuOptions
									)?.id
								) }
								style={ {
									marginTop: '8px',
									display: 'flex',
									justifyContent: 'center',
								} }
							>
								{ getMenuOptionDetails( menuSlug, menuOptions )
									?.label + __( 'Edit', 'mone' ) }
							</Button>
						) }
						<Button
							variant="secondary"
							href={ createPartsUrl }
							style={ {
								marginTop: '8px',
								display: 'flex',
								justifyContent: 'center',
							} }
						>
							{ __( 'Create a template part', 'mone' ) }
						</Button>
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Click to open', 'mone' ) }
						isShownByDefault
						hasValue={ () => !! megaMenuType }
						onDeselect={ () =>
							setAttributes( {
								megaMenuType: undefined,
							} )
						}
					>
						<ToggleGroupControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							isBlock
							label={ __( 'Click to open', 'mone' ) }
							value={
								megaMenuType === 'hover' ? 'hover' : 'click'
							}
							onChange={ ( value ) =>
								setAttributes( {
									megaMenuType:
										value === 'click' ? undefined : 'hover',
								} )
							}
						>
							<ToggleGroupControlOption
								value="click"
								label={ __( 'Click', 'mone' ) }
							/>
							<ToggleGroupControlOption
								value="hover"
								label={ __( 'Hover', 'mone' ) }
							/>
						</ToggleGroupControl>
					</ToolsPanelItem>
					{ megaMenuType === 'hover' && (
						<>
							<ToolsPanelItem
								label={ __( 'Link' ) }
								isShownByDefault
								hasValue={ () => !! url }
								onDeselect={ () =>
									setAttributes( {
										url: undefined,
									} )
								}
							>
								<TextControl
									__nextHasNoMarginBottom
									__next40pxDefaultSize
									value={ url ? safeDecodeURI( url ) : '' }
									onChange={ ( urlValue ) => {
										setAttributes( { url: urlValue } );
									} }
									label={ __( 'Link' ) }
									autoComplete="off"
								/>
							</ToolsPanelItem>
							{ url && (
								<>
									<ToolsPanelItem
										label={ __( 'Open in new tab' ) }
										isShownByDefault
										hasValue={ () => !! linkTarget }
										onDeselect={ () =>
											setAttributes( {
												linkTarget: '_self',
											} )
										}
									>
										<ToggleControl
											__nextHasNoMarginBottom
											label={ __( 'Open in new tab' ) }
											onChange={ ( value ) =>
												setAttributes( {
													linkTarget: value
														? '_blank'
														: '_self',
												} )
											}
											checked={ linkTarget === '_blank' }
										/>
									</ToolsPanelItem>
									<ToolsPanelItem
										label={ __( 'Link rel' ) }
										isShownByDefault
										hasValue={ () => !! rel }
										onDeselect={ () =>
											setAttributes( {
												rel: undefined,
											} )
										}
									>
										<TextControl
											__nextHasNoMarginBottom
											label={ __( 'Link rel' ) }
											value={ rel }
											onChange={ ( newRel ) =>
												setAttributes( { rel: newRel } )
											}
										/>
									</ToolsPanelItem>
								</>
							) }
							<ToolsPanelItem
								label={ __( 'Title attribute' ) }
								isShownByDefault
								hasValue={ () => !! title }
								onDeselect={ () =>
									setAttributes( {
										title: undefined,
									} )
								}
							>
								<TextControl
									__nextHasNoMarginBottom
									__next40pxDefaultSize
									value={ title || '' }
									onChange={ ( titleValue ) => {
										setAttributes( { title: titleValue } );
									} }
									label={ __( 'Title attribute' ) }
									autoComplete="off"
								/>
							</ToolsPanelItem>
						</>
					) }
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				<RichText
					identifier="label"
					className="wp-block-navigation-item__label"
					value={ label }
					onChange={ ( labelValue ) =>
						setAttributes( {
							label: labelValue,
						} )
					}
					aria-label={ __( 'Mega menu link text', 'mone' ) }
					placeholder={ __( 'Mega menu label', 'mone' ) }
					allowedFormats={ [
						'core/bold',
						'core/italic',
						'core/image',
						'core/strikethrough',
						'mone/inline-icon',
					] }
				/>
			</div>
		</>
	);
}
