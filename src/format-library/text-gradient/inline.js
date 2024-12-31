/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';
import {
	useCachedTruthy,
	getGradientValueBySlug,
	__experimentalGetGradientObjectByGradientValue,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { Popover, GradientPicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { inlineSettings as settings, transparentValue } from './index';

function parseCSS( css = '', gradientsSettings ) {
	return css.split( ';' ).reduce( ( accumulator, rule ) => {
		if ( rule ) {
			const [ property, value ] = rule.split( ':' );
			if (
				property === '--the-gradient-color-for-text' &&
				value !== transparentValue
			) {
				const gradientValue = value.startsWith(
					'var(--wp--preset--gradient--'
				)
					? getGradientValueBySlug(
							gradientsSettings,
							value
								.replace( 'var(--wp--preset--gradient--', '' )
								.replace( ')', '' )
					  )
					: value;
				accumulator.gradientColor = gradientValue;
			}
		}
		return accumulator;
	}, {} );
}

function parseClassName( className = '' ) {
	return className.split( ' ' );
}

export function getActiveColors( value, name, gradientsSettings ) {
	const activeColorFormat = getActiveFormat( value, name );

	if ( ! activeColorFormat ) {
		return {};
	}

	return {
		...parseCSS( activeColorFormat.attributes.style, gradientsSettings ),
		...parseClassName( activeColorFormat.attributes.class ),
	};
}

function setColors( value, name, colors, gradientSettings ) {
	const gradientValues = gradientSettings
		.map( ( setting ) => setting.gradients )
		.flat();
	const { gradientColor } = {
		...getActiveColors( value, name, gradientValues ),
		...colors,
	};

	if ( ! gradientColor ) {
		return removeFormat( value, name );
	}

	const styles = [];
	const classNames = [];
	const attributes = {};

	const gradientObject = __experimentalGetGradientObjectByGradientValue(
		gradientValues,
		gradientColor
	);
	if ( gradientObject || gradientColor ) {
		const gradient = gradientObject
			? `var(--wp--preset--gradient--${ gradientObject.slug })`
			: gradientColor;
		styles.push( `--the-gradient-color-for-text:${ gradient }` );
	}

	if ( styles.length ) {
		attributes.style = styles.join( ';' );
	}
	if ( classNames.length ) {
		attributes.class = classNames.join( ' ' );
	}

	return applyFormat( value, { type: name, attributes } );
}

function ColorPicker( { name, property, value, onChange } ) {
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const activeColors = useMemo(
		() => getActiveColors( value, name, gradientValues ),
		[ name, value, gradientValues ]
	);

	const onColorChange = useCallback(
		( color ) => {
			onChange(
				setColors(
					value,
					name,
					{ [ property ]: color },
					colorGradientSettings.gradients
				)
			);
		},
		[ onChange, property, value, name, colorGradientSettings.gradients ]
	);

	return (
		<GradientPicker
			value={ activeColors[ property ] }
			onChange={ onColorChange }
			gradients={ colorGradientSettings.gradients }
		/>
	);
}

export default function InlineColorUI( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	isActive,
} ) {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: { ...settings, isActive },
	} );
	const cachedRect = useCachedTruthy( popoverAnchor.getBoundingClientRect() );
	popoverAnchor.getBoundingClientRect = () => cachedRect;

	return (
		<Popover
			onClose={ onClose }
			className="format-library__inline-color-popover mone-gradient-popover"
			anchor={ popoverAnchor }
		>
			<div className="mone-gradient-popover-color-picker">
				<div className="mone-gradient-popover-color-picker-title">
					{ __( 'Text Gradient', 'mone' ) }
				</div>
				<ColorPicker
					name={ name }
					property={ 'gradientColor' }
					value={ value }
					onChange={ onChange }
				/>
			</div>
		</Popover>
	);
}
