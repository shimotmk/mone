/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { Disabled } from '@wordpress/components';

import metadata from './block.json';

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { url } = attributes;

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls group="settings"></InspectorControls>
			<div { ...blockProps }>
				<Disabled>
					<ServerSideRender
						skipBlockSupportAttributes
						block={ metadata.name }
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		</>
	);
}
