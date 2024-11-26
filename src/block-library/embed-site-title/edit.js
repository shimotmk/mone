/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToolbarGroup,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
	HeadingLevelDropdown,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import useRemoteUrlData from '../embed/api/use-rich-url-data';

const HEADING_LEVELS = [ 0, 1, 2, 3, 4, 5, 6 ];

export default function EmbedSiteTitleEdit( props ) {
	const { attributes, setAttributes, context } = props;
	const { level, isLink, rel, linkTarget } = attributes;
	const { richData } = useRemoteUrlData( context[ 'mone/embed-url' ] );
	const siteName = richData?.data.site_title ?? '';

	const TagName = level === 0 ? 'p' : `h${ level }`;
	const blockProps = useBlockProps();

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<HeadingLevelDropdown
						options={ HEADING_LEVELS }
						value={ level }
						onChange={ ( newLevel ) =>
							setAttributes( { level: newLevel } )
						}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Link to home page', 'mone' ) }
						onChange={ () => setAttributes( { isLink: ! isLink } ) }
						checked={ isLink }
					/>
					{ isLink && (
						<>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Open in new tab' ) }
								onChange={ ( value ) =>
									setAttributes( {
										linkTarget: value ? '_blank' : '_self',
									} )
								}
								checked={ linkTarget === '_blank' }
							/>
							<TextControl
								__nextHasNoMarginBottom
								label={ __( 'Link rel' ) }
								value={ rel }
								onChange={ ( newRel ) =>
									setAttributes( { rel: newRel } )
								}
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<TagName { ...blockProps }>
				{ isLink ? (
					<a
						href="#embed-site-title-pseudo-link"
						onClick={ ( event ) => event.preventDefault() }
					>
						{ siteName && siteName }
					</a>
				) : (
					siteName && siteName
				) }
			</TagName>
		</>
	);
}
