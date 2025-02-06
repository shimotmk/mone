/**
 * Parts of this source were derived and modified from Gutenberg,
 * released under the GPL or MPL license.
 *
 * https://github.com/WordPress/gutenberg/blob/d70f27875baa4db085196a22d688fe9c3256f736/packages/block-editor/src/components/gradients/use-gradient.js
 *
 * https://github.com/WordPress/gutenberg?tab=License-1-ov-file
 */

/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	store as blockEditorStore,
	useSettings,
} from '@wordpress/block-editor';

export function __experimentalGetGradientClass( gradientSlug ) {
	if ( ! gradientSlug ) {
		return undefined;
	}
	return `has-${ gradientSlug }-gradient-background`;
}

/**
 * Retrieves the gradient value per slug.
 *
 * @param {Array}  gradients Gradient Palette
 * @param {string} slug      Gradient slug
 *
 * @return {string} Gradient value.
 */
export function getGradientValueBySlug( gradients, slug ) {
	const gradient = gradients?.find( ( g ) => g.slug === slug );
	return gradient && gradient.gradient;
}

export function __experimentalGetGradientObjectByGradientValue(
	gradients,
	value
) {
	const gradient = gradients?.find( ( g ) => g.gradient === value );
	return gradient;
}

/**
 * Retrieves the gradient slug per slug.
 *
 * @param {Array}  gradients Gradient Palette
 * @param {string} value     Gradient value
 * @return {string} Gradient slug.
 */
export function getGradientSlugByValue( gradients, value ) {
	const gradient = __experimentalGetGradientObjectByGradientValue(
		gradients,
		value
	);
	return gradient && gradient.slug;
}

export function __experimentalUseGradient( {
	gradientAttribute = 'gradient',
	customGradientAttribute = 'customGradient',
	clientIds,
} = {} ) {
	const [
		userGradientPalette,
		themeGradientPalette,
		defaultGradientPalette,
	] = useSettings(
		'color.gradients.custom',
		'color.gradients.theme',
		'color.gradients.default'
	);
	const allGradients = useMemo(
		() => [
			...( userGradientPalette || [] ),
			...( themeGradientPalette || [] ),
			...( defaultGradientPalette || [] ),
		],
		[ userGradientPalette, themeGradientPalette, defaultGradientPalette ]
	);
	const { gradient, customGradient } = useSelect(
		( select ) => {
			const { getBlockAttributes } = select( blockEditorStore );
			const attributes = getBlockAttributes( clientIds[ 0 ] ) || {};
			return {
				customGradient: attributes[ customGradientAttribute ],
				gradient: attributes[ gradientAttribute ],
			};
		},
		[ clientIds, gradientAttribute, customGradientAttribute ]
	);

	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const setGradient = useCallback(
		( newGradientValue ) => {
			const slug = getGradientSlugByValue(
				allGradients,
				newGradientValue
			);
			if ( slug ) {
				clientIds.forEach( ( childId ) => {
					updateBlockAttributes( childId, {
						[ gradientAttribute ]: slug,
						[ customGradientAttribute ]: undefined,
					} );
				} );
				return;
			}
			clientIds.forEach( ( childId ) => {
				updateBlockAttributes( childId, {
					[ gradientAttribute ]: undefined,
					[ customGradientAttribute ]: newGradientValue,
				} );
			} );
		},
		[
			allGradients,
			clientIds,
			updateBlockAttributes,
			gradientAttribute,
			customGradientAttribute,
		]
	);

	const gradientClass = __experimentalGetGradientClass( gradient );
	let gradientValue;
	if ( gradient ) {
		gradientValue = getGradientValueBySlug( allGradients, gradient );
	} else {
		gradientValue = customGradient;
	}
	return { gradientClass, gradientValue, setGradient };
}
