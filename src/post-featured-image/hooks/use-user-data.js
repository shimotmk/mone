import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';

export const useUserData = () => {
	const [ myIconUrl, setMyIconUrl ] = useState( false );
	const [ myName, setMyName ] = useState( '' );
	const [ isRequestingMyData, setIsRequestingMyData ] = useState( false );

	useEffect( () => {
		const fetchUserMeta = async () => {
			setIsRequestingMyData( true );
			try {
				const response = await apiFetch( { path: '/wp/v2/users/me' } );
				const { name, meta } = response;
				if ( meta?.mone_icon_url ) {
					setMyIconUrl( meta.mone_icon_url );
				}
				if ( name ) {
					setMyName( name );
				}
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'Error fetching user meta:', error );
			} finally {
				setIsRequestingMyData( false );
			}
		};
		fetchUserMeta();
	}, [] );

	return {
		myName,
		myIconUrl,
		isRequestingMyData,
	};
};
