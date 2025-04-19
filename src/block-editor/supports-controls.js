/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

function supportsDefaultControls( settings ) {
	const excludedPrefixes = [ 'core/', 'mone/' ];
	if (
		! excludedPrefixes.some( ( prefix ) =>
			settings.name.startsWith( prefix )
		)
	) {
		return settings;
	}

	if ( ! settings.supports ) {
		return settings;
	}

	if ( settings.supports?.background ) {
		settings.supports.background = {
			...settings.supports.background,
			__experimentalDefaultControls: {
				...settings.supports?.backgroundImage
					?.__experimentalDefaultControls,
				backgroundImage: true,
			},
		};
	}

	if ( settings.supports?.dimensions ) {
		settings.supports.dimensions = {
			...settings.supports.dimensions,
			__experimentalDefaultControls: {
				...settings.supports?.dimensions?.__experimentalDefaultControls,
				minHeight: true,
			},
		};
	}

	if ( settings.supports?.spacing ) {
		settings.supports.spacing = {
			...settings.supports.spacing,
			__experimentalDefaultControls: {
				...settings.supports?.spacing?.__experimentalDefaultControls,
				margin: true,
				padding: true,
				blockGap: true,
			},
		};
	}

	if ( settings.supports?.__experimentalBorder ) {
		settings.supports.__experimentalBorder = {
			...settings.supports?.__experimentalBorder,
			__experimentalDefaultControls: {
				...settings.supports?.__experimentalBorder
					?.__experimentalDefaultControls,
				color: true,
				radius: true,
				style: true,
				width: true,
				shadow: true,
			},
		};
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/supports-default-controls',
	supportsDefaultControls,
	11
);
