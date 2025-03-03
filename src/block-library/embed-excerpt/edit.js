/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	RangeControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import useRemoteUrlData from '../embed/api/use-rich-url-data';
import { useToolsPanelDropdownMenuProps } from '../../utils-func/use-tools-panel-dropdown';

const ELLIPSIS = '…';

export default function EmbedExcerptEdit( props ) {
	const { attributes, setAttributes, context } = props;
	const { excerptLength } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const { richData } = useRemoteUrlData( context[ 'mone/embed-url' ] );
	const excerpt = richData?.data.excerpt ?? '';

	const blockProps = useBlockProps();

	const wordCountType = _x( 'words', 'Word count type. Do not translate!' );

	let trimmedExcerpt = '';
	if ( wordCountType === 'words' ) {
		trimmedExcerpt = excerpt.split( ' ', excerptLength ).join( ' ' );
	} else if ( wordCountType === 'characters_excluding_spaces' ) {
		/*
		 * 1. Split the excerpt at the character limit,
		 * then join the substrings back into one string.
		 * 2. Count the number of spaces in the excerpt
		 * by comparing the lengths of the string with and without spaces.
		 * 3. Add the number to the length of the visible excerpt,
		 * so that the spaces are excluded from the word count.
		 */
		const excerptWithSpaces = excerpt.split( '', excerptLength ).join( '' );

		const numberOfSpaces =
			excerptWithSpaces.length -
			excerptWithSpaces.replaceAll( ' ', '' ).length;

		trimmedExcerpt = excerpt
			.split( '', excerptLength + numberOfSpaces )
			.join( '' );
	} else if ( wordCountType === 'characters_including_spaces' ) {
		trimmedExcerpt = excerpt.split( '', excerptLength ).join( '' );
	}

	const isTrimmed =
		excerptLength && excerpt.length > trimmedExcerpt.length ? true : false;

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							excerptLength: undefined,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Max number of words' ) }
						isShownByDefault
						hasValue={ () => !! excerptLength }
						onDeselect={ () =>
							setAttributes( {
								excerptLength: undefined,
							} )
						}
					>
						<RangeControl
							label={ __( 'Max number of words' ) }
							value={ excerptLength }
							onChange={ ( value ) => {
								setAttributes( { excerptLength: value } );
							} }
							min="1"
							max={ excerpt.length }
							allowReset={ false }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div { ...blockProps }>
				<p className="wp-block-mone-embed-excerpt__excerpt">
					{ ! isTrimmed
						? decodeEntities( trimmedExcerpt )
						: decodeEntities( trimmedExcerpt ) + ELLIPSIS }
				</p>
			</div>
		</>
	);
}
