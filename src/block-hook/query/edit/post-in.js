/**
 * WordPress dependencies
 */
import {
	TextControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export const PostIncludeControls = ( { attributes, setAttributes } ) => {
	const { query: { include_posts: includePostIds = [] } = {} } = attributes;

	return (
		<>
			<ToolsPanelItem
				label={ __( 'Post Ids', 'mone' ) }
				isShownByDefault
				hasValue={ () => !! includePostIds?.length }
				onDeselect={ () =>
					setAttributes( {
						query: {
							...attributes.query,
							include_posts: [],
						},
					} )
				}
			>
				<TextControl
					label={ __( 'Post Ids', 'mone' ) }
					value={ includePostIds.join( ',' ) || '' }
					onChange={ ( value ) => {
						const newIncludePostIds = value
							.split( ',' )
							.map( ( id ) => id.trim() );
						setAttributes( {
							query: {
								...attributes.query,
								include_posts: newIncludePostIds || [],
							},
						} );
					} }
					placeholder={ __( 'Example: 1,4,7', 'mone' ) }
					help={ __( '*Please enter with commas.', 'mone' ) }
					__nextHasNoMarginBottom
				/>
			</ToolsPanelItem>
		</>
	);
};
