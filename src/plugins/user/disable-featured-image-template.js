/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, useSelect } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';
import { ToggleControl } from '@wordpress/components';

const PREFERENCE_SCOPE = 'mone/show-featured-image-template';

dispatch( preferencesStore ).setDefaults( PREFERENCE_SCOPE, {
	showFeaturedImageTemplate: true,
} );

export const usePreferencesStore = ( key ) =>
	useSelect(
		( select ) => {
			return select( preferencesStore ).get( PREFERENCE_SCOPE, key );
		},
		[ key ]
	);

export const setPreferencesStore = ( key, value ) => {
	dispatch( preferencesStore ).set( PREFERENCE_SCOPE, key, value );
};

export const ShowFeaturedImageTemplateToggle = () => {
	const showFeaturedImageTemplate = usePreferencesStore(
		'showFeaturedImageTemplate'
	);
	const setData = ( value ) => {
		setPreferencesStore( 'showFeaturedImageTemplate', value );
	};

	return (
		<>
			<ToggleControl
				__nextHasNoMarginBottom
				checked={ showFeaturedImageTemplate }
				label={ __( 'Display eye-catching template', 'mone' ) }
				onChange={ ( value ) => {
					setData( value );
				} }
			/>
		</>
	);
};
