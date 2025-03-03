/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	TextControl,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import useRemoteUrlData from '../embed/api/use-rich-url-data';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

export default function EmbedSiteLogoEdit( props ) {
	const { attributes, setAttributes, context } = props;
	const { isLink, rel, linkTarget } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const blockProps = useBlockProps();
	const borderProps = useBorderProps( attributes );
	const { richData } = useRemoteUrlData( context[ 'mone/embed-url' ] );
	const favicon = richData?.data.site_logo ?? '';

	const imageStyles = {
		...borderProps.style,
	};

	return (
		<>
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
			<figure { ...blockProps }>
				{ favicon && (
					<img
						className={ borderProps.className }
						src={ favicon }
						alt=""
						style={ imageStyles }
					/>
				) }
			</figure>
		</>
	);
}
