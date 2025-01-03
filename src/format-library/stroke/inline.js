/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';
import {
	ColorPalette,
	useCachedTruthy,
	store as blockEditorStore,
	getColorObjectByColorValue,
	getColorObjectByAttributeValues,
} from '@wordpress/block-editor';
import {
	Popover,
	__experimentalUnitControl as UnitControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { inlineSettings as settings } from './index';

function parseCSS( css = '', colorSettings ) {
	return css.split( ';' ).reduce( ( accumulator, rule ) => {
		if ( rule ) {
			const [ property, value ] = rule.split( ':' );
			if ( property === '--the-stroke-color' ) {
				const colorSlug = value
					.replace( 'var(--wp--preset--color--', '' )
					.replace( ')', '' );
				const strokeValue = value.startsWith(
					'var(--wp--preset--color--'
				)
					? getColorObjectByAttributeValues(
							colorSettings,
							colorSlug
					  ).color
					: value;
				accumulator.strokeColor = strokeValue;
			}
			if ( property === '--the-stroke-width' ) {
				accumulator.strokeWidth = value;
			}
		}
		return accumulator;
	}, {} );
}

function parseClassName( className = '' ) {
	return className.split( ' ' );
}

export function getActiveColors( value, name, colorSettings ) {
	const activeColorFormat = getActiveFormat( value, name );

	if ( ! activeColorFormat ) {
		return {};
	}

	return {
		...parseCSS( activeColorFormat.attributes.style, colorSettings ),
		...parseClassName( activeColorFormat.attributes.class ),
	};
}

function setColors( value, name, colorSettings, colors ) {
	const { strokeColor, strokeWidth } = {
		...getActiveColors( value, name, colorSettings ),
		...colors,
	};

	if ( ! strokeColor && ! strokeWidth ) {
		return removeFormat( value, name );
	}

	const styles = [];
	const classNames = [];
	const attributes = {};

	if ( strokeColor ) {
		const colorObject = getColorObjectByColorValue(
			colorSettings,
			strokeColor
		);
		if ( colorObject ) {
			styles.push(
				[
					'--the-stroke-color',
					`var(--wp--preset--color--${ colorObject.slug })`,
				].join( ':' )
			);
		} else {
			styles.push( [ '--the-stroke-color', strokeColor ].join( ':' ) );
		}
	}

	if ( strokeWidth ) {
		styles.push( [ '--the-stroke-width', strokeWidth ].join( ':' ) );
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
	const colors = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const activeColors = useMemo(
		() => getActiveColors( value, name, colors ),
		[ name, value, colors ]
	);

	const onColorChange = useCallback(
		( color ) => {
			onChange(
				setColors( value, name, colors, { [ property ]: color } )
			);
		},
		[ onChange, property, value, name, colors ]
	);

	return (
		<ColorPalette
			value={ activeColors[ property ] }
			onChange={ onColorChange }
			clearable={ false }
			enableAlpha={ true }
		/>
	);
}

function StrokeWidth( { name, property, value, onChange } ) {
	const colors = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const activeColors = useMemo(
		() => getActiveColors( value, name, colors ),
		[ name, value, colors ]
	);

	return (
		<>
			<UnitControl
				label={ __( 'Stroke width', 'mone' ) }
				__next40pxDefaultSize
				onChange={ ( color ) => {
					onChange(
						setColors( value, name, colors, {
							[ property ]: color,
						} )
					);
				} }
				min={ 0 }
				max={ 40 }
				value={ activeColors[ property ] }
				units={ [
					{
						a11yLabel: 'px',
						label: 'px',
						step: 0.01,
						value: 'px',
					},
				] }
			/>
		</>
	);
}

export default function InlineUI( {
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
			<div className="mone-gradient-popover-color-picker stroke-popover">
				<ColorPicker
					name={ name }
					property={ 'strokeColor' }
					value={ value }
					onChange={ onChange }
				/>
				<StrokeWidth
					name={ name }
					property={ 'strokeWidth' }
					value={ value }
					onChange={ onChange }
				/>
				<div className="mone-clear-button">
					<Button
						variant="secondary"
						onClick={ () => {
							onChange( removeFormat( value, name ) );
							onClose();
						} }
						size="small"
					>
						{ __( 'All clear', 'mone' ) }
					</Button>
				</div>
			</div>
		</Popover>
	);
}
