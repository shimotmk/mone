/**
 * WordPress dependencies
 */
import { createBlock, parse, serialize } from '@wordpress/blocks';
import { addWidgetIdToBlock } from '@wordpress/widgets';

export function transformWidgetToBlock( widget ) {
	if ( widget.id_base === 'block' ) {
		const parsedBlocks = parse( widget.instance.raw.content, {
			__unstableSkipAutop: true,
		} );
		if ( ! parsedBlocks.length ) {
			return addWidgetIdToBlock(
				createBlock( 'core/paragraph', {}, [] ),
				widget.id
			);
		}
		return addWidgetIdToBlock( parsedBlocks[ 0 ], widget.id );
	}

	let attributes;
	if ( widget._embedded.about[ 0 ].is_multi ) {
		attributes = {
			idBase: widget.id_base,
			instance: widget.instance,
		};
	} else {
		attributes = {
			id: widget.id,
		};
	}

	return addWidgetIdToBlock(
		createBlock( 'core/legacy-widget', attributes, [] ),
		widget.id
	);
}
