/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { store as coreStore } from '@wordpress/core-data';

const areArraysEqual = ( a, b ) =>
	Array.isArray( a ) &&
	Array.isArray( b ) &&
	a.length === b.length &&
	a.every( ( value, index ) => value === b[ index ] );

const isSamePostType = ( a, b ) =>
	a.value === b.value &&
	a.label === b.label &&
	areArraysEqual( a.taxonomies, b.taxonomies ) &&
	a.hasArchive === b.hasArchive &&
	a.isHierarchical === b.isHierarchical;

export const usePostTypes = () => {
	const previousPostTypesRef = useRef();

	const postTypes = useSelect( ( select ) => {
		const availablePostTypes = select( coreStore ).getPostTypes( {
			per_page: -1,
		} );
		let publicPostTypes = [];

		// Remove post types that are not public and also remove media (attachements).
		if ( availablePostTypes && availablePostTypes.length !== 0 ) {
			publicPostTypes = availablePostTypes.filter(
				( postType ) =>
					postType.viewable && postType.slug !== 'attachment'
			);
		}

		const nextPostTypes = ( publicPostTypes ?? [] ).map( ( postType ) => {
			const label = postType.labels?.singular_name ?? postType.name;

			return {
				value: postType.slug,
				label: decodeEntities( label ),
				taxonomies: postType.taxonomies,
				hasArchive:
					postType.slug === 'post' ? true : postType.has_archive,
				isHierarchical: postType.hierarchical,
			};
		} );

		const previousPostTypes = previousPostTypesRef.current;
		const isSame =
			Array.isArray( previousPostTypes ) &&
			previousPostTypes.length === nextPostTypes.length &&
			previousPostTypes.every( ( previousPostType, index ) =>
				isSamePostType( previousPostType, nextPostTypes[ index ] )
			);

		if ( isSame ) {
			return previousPostTypes;
		}

		previousPostTypesRef.current = nextPostTypes;
		return nextPostTypes;
	}, [] );

	return postTypes;
};
