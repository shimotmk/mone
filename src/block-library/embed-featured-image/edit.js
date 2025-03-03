/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import useRemoteUrlData from '../embed/api/use-rich-url-data';
import DimensionControls from './dimension-controls';
import OverlayControls from './overlay-controls';
import Overlay from './overlay';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

export default function EmbedFeaturedImageEdit( props ) {
	const { attributes, setAttributes, context, clientId } = props;
	const { isLink, aspectRatio, height, width, scale, rel, linkTarget } =
		attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const { richData } = useRemoteUrlData( context[ 'mone/embed-url' ] );
	const featuredImage = richData?.data.featured_image;

	const blockProps = useBlockProps( {
		style: { width, height, aspectRatio },
	} );
	const borderProps = useBorderProps( attributes );
	const shadowProps = getShadowClassesAndStyles( attributes );

	const imageStyles = {
		...borderProps.style,
		...shadowProps.style,
		height: aspectRatio ? '100%' : height,
		width: !! aspectRatio && '100%',
		objectFit: !! ( height || aspectRatio ) && scale,
	};

	return (
		<>
			<InspectorControls group="color">
				<OverlayControls
					attributes={ attributes }
					setAttributes={ setAttributes }
					clientId={ clientId }
				/>
			</InspectorControls>
			<DimensionControls
				clientId={ clientId }
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
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
				{ featuredImage && (
					<img
						className={ borderProps.className }
						src={ featuredImage }
						alt=""
						style={ imageStyles }
					/>
				) }
				<Overlay
					attributes={ attributes }
					setAttributes={ setAttributes }
					clientId={ clientId }
				/>
			</figure>
		</>
	);
}
