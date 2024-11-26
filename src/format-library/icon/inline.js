/**
 * WordPress dependencies
 */
import {
	applyFormat,
	insert,
	create,
	useAnchor,
	getActiveFormat,
} from '@wordpress/rich-text';
import { useCachedTruthy } from '@wordpress/block-editor';
import { Modal } from '@wordpress/components';
import { renderToString } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { inlineIconSettings as settings } from './index';
import {
	ReactIcon,
	createSvgUrl,
} from '../../components/icon-search-popover/ReactIcon';
import { IconPopoverContent } from '../../components/icon-search-popover';

function InlineIconPicker( { name, value, onChange, setIsAdding } ) {
	const getInsertIconValue = ( icon ) => {
		const SVG = renderToString( <ReactIcon icon={ icon } size="100%" /> );
		const dataSvg = createSvgUrl( SVG );

		const activeFormat = getActiveFormat( value, name );
		if ( ! activeFormat ) {
			value.activeFormats = {};
		}

		let newValue = value;
		let html = '';
		html += `<span class="mone-inline-icon" aria-hidden="true" style="--the-icon-svg: url(${ dataSvg });" >&emsp;</span>`;
		newValue = insert(
			newValue,
			applyFormat( create( { html } ), {
				type: name,
				attributes: {
					class: 'mone-inline-icon',
				},
			} )
		);

		onChange( newValue );
		setIsAdding( false );
	};

	return (
		<IconPopoverContent
			onChange={ getInsertIconValue }
			// value={searchValue}
			setIsVisible={ setIsAdding }
		/>
	);
}

export default function InlineIconUI( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	setIsAdding,
} ) {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );
	const cachedRect = useCachedTruthy( popoverAnchor.getBoundingClientRect() );
	popoverAnchor.getBoundingClientRect = () => cachedRect;

	return (
		<Modal className="mone-icon-modal" onRequestClose={ onClose }>
			<InlineIconPicker
				name={ name }
				value={ value }
				onChange={ onChange }
				setIsAdding={ setIsAdding }
			/>
		</Modal>
	);
}
