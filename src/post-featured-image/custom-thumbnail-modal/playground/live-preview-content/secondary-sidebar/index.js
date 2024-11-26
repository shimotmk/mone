/**
 * WordPress dependencies
 */
import { __experimentalListView as ListView } from '@wordpress/block-editor';
import { useFocusOnMount, useMergeRefs } from '@wordpress/compose';
import { useState } from '@wordpress/element';

export default function ListViewSidebar() {
	const [ dropZoneElement, setDropZoneElement ] = useState( null );

	const focusOnMountRef = useFocusOnMount( 'firstElement' );

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div className="edit-widgets-editor__list-view-panel">
			<div
				className="edit-widgets-editor__list-view-panel-content"
				ref={ useMergeRefs( [ focusOnMountRef, setDropZoneElement ] ) }
			>
				<ListView dropZoneElement={ dropZoneElement } />
			</div>
		</div>
	);
}
