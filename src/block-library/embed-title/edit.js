/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	TextControl,
	ToolbarGroup,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
	HeadingLevelDropdown,
} from '@wordpress/block-editor';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import useRemoteUrlData from '../embed/api/use-rich-url-data';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

export default function EmbedTitleEdit( props ) {
	const { attributes, setAttributes, context } = props;
	const { level, isLink, rel, linkTarget } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const { richData } = useRemoteUrlData( context[ 'mone/embed-url' ] );
	const title = richData?.data.title;

	const TagName = level === 0 ? 'p' : `h${ level }`;
	const blockProps = useBlockProps();

	return (
		<>
			<BlockControls group="block">
				<ToolbarGroup>
					<HeadingLevelDropdown
						value={ level }
						onChange={ ( newLevel ) =>
							setAttributes( { level: newLevel } )
						}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							isLink: undefined,
							linkTarget: '_self',
							rel: undefined,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Link to URL', 'mone' ) }
						isShownByDefault
						hasValue={ () => !! isLink }
						onDeselect={ () =>
							setAttributes( {
								isLink: undefined,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Link to URL', 'mone' ) }
							onChange={ () =>
								setAttributes( { isLink: ! isLink } )
							}
							checked={ isLink || '' }
						/>
					</ToolsPanelItem>
					{ isLink && (
						<>
							<ToolsPanelItem
								label={ __( 'Open in new tab' ) }
								isShownByDefault
								hasValue={ () =>
									isLink && linkTarget !== '_self'
								}
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
								hasValue={ () => isLink && !! rel }
								onDeselect={ () =>
									setAttributes( {
										rel: undefined,
									} )
								}
							>
								<TextControl
									__nextHasNoMarginBottom
									label={ __( 'Link rel' ) }
									value={ rel || '' }
									onChange={ ( newRel ) =>
										setAttributes( { rel: newRel } )
									}
								/>
							</ToolsPanelItem>
						</>
					) }
				</ToolsPanel>
			</InspectorControls>
			<TagName { ...blockProps }>
				{ isLink ? (
					<a
						href="#embed-title-pseudo-link"
						onClick={ ( event ) => event.preventDefault() }
					>
						{ title && decodeEntities( title ) }
					</a>
				) : (
					title && decodeEntities( title )
				) }
			</TagName>
		</>
	);
}
