/**
 * WordPress dependencies
 */
import { useCallback, useMemo, useState } from '@wordpress/element';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';
import { useCachedTruthy } from '@wordpress/block-editor';
import { Popover, TextControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { inlineSettings as settings } from './index';

function setDialog( value, name, newValue ) {
	const attributes = {};

	if ( newValue ) {
		attributes.url = newValue;
	}

	return applyFormat( value, { type: name, attributes } );
}

export default function InlineUI( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	isActive,
	activeAttributes,
} ) {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: { ...settings, isActive },
	} );
	const cachedRect = useCachedTruthy( popoverAnchor.getBoundingClientRect() );
	popoverAnchor.getBoundingClientRect = () => cachedRect;
	const [ preUrl, setPreUrl ] = useState( activeAttributes?.url || '' );

	const onDialogChange = useCallback( () => {
		onChange( setDialog( value, name, preUrl ) );
	}, [ onChange, value, name, preUrl ] );

	return (
		<Popover
			onClose={ onClose }
			className="format-library__inline-color-popover mone-gradient-popover"
			anchor={ popoverAnchor }
		>
			<div className="mone-gradient-popover-color-picker">
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					value={ preUrl }
					onChange={ setPreUrl }
				/>
				<Button
					variant="secondary"
					onClick={ () => {
						onDialogChange();
						onClose();
					} }
				>
					{ __( 'Save', 'mone' ) }
				</Button>
			</div>
		</Popover>
	);
}
