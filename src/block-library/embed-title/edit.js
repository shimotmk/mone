/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	TextControl,
	ToolbarGroup,
	PanelBody,
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

export default function EmbedTitleEdit( props ) {
	const { attributes, setAttributes, context } = props;
	const { level, isLink, rel, linkTarget } = attributes;
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
				<PanelBody title={ __( 'Settings' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Link to URL', 'mone' ) }
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
