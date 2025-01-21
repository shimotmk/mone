/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { applyFormat, useAnchor, removeFormat } from '@wordpress/rich-text';
import {
	ColorPalette,
	useCachedTruthy,
	store as blockEditorStore,
	getColorObjectByColorValue,
	__experimentalGetGradientObjectByGradientValue,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { Popover, GradientPicker, TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { inlineIconSettings as settings } from './index';
import { getActiveIcons } from './inline';

function setColors( value, name, colorSettings, colors, gradientSettings ) {
	const { iconColor } = {
		...getActiveIcons( value, name, colorSettings, gradientSettings ),
		...colors,
	};
	const gradientValues = gradientSettings
		?.map( ( setting ) => setting.gradients )
		.flat();
	const { iconGradientColor } = {
		...getActiveIcons( value, name, colorSettings, gradientSettings ),
		...colors,
	};

	const styles = [];
	const classNames = [];
	const attributes = {};
	const activeFormat = getActiveIcons(
		value,
		name,
		colorSettings,
		gradientSettings
	);

	if ( activeFormat[ '--the-icon-name' ] ) {
		styles.push(
			[ '--the-icon-name', activeFormat[ '--the-icon-name' ] ].join( ':' )
		);
	}
	if ( activeFormat[ '--the-icon-svg' ] ) {
		styles.push(
			[ '--the-icon-svg', activeFormat[ '--the-icon-svg' ] ].join( ':' )
		);
	}
	if ( iconColor ) {
		const colorObject = getColorObjectByColorValue(
			colorSettings,
			iconColor
		);
		if ( colorObject ) {
			styles.push(
				[
					'--the-icon-color',
					`var(--wp--preset--color--${ colorObject.slug })`,
				].join( ':' )
			);
		} else {
			styles.push( [ '--the-icon-color', iconColor ].join( ':' ) );
		}
	}

	const gradientObject = __experimentalGetGradientObjectByGradientValue(
		gradientValues,
		iconGradientColor
	);
	if ( gradientObject || iconGradientColor ) {
		const gradient = gradientObject
			? `var(--wp--preset--gradient--${ gradientObject.slug })`
			: iconGradientColor;
		styles.push( `--the-icon-gradient-color:${ gradient }` );
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
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const activeColors = useMemo(
		() => getActiveIcons( value, name, colors, gradientValues ),
		[ name, value, colors, gradientValues ]
	);

	const onColorChange = useCallback(
		( color ) => {
			onChange(
				setColors(
					value,
					name,
					colors,
					{ [ property ]: color },
					colorGradientSettings.gradients
				)
			);
		},
		[ onChange, property, value, name, colors, colorGradientSettings ]
	);

	return (
		<ColorPalette
			value={ activeColors[ '--the-icon-color' ] }
			onChange={ onColorChange }
			clearable={ true }
			enableAlpha={ true }
		/>
	);
}

function GradientColorPicker( { name, property, value, onChange } ) {
	const colors = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const activeColors = useMemo(
		() => getActiveIcons( value, name, colors, gradientValues ),
		[ name, value, colors, gradientValues ]
	);

	const onColorChange = useCallback(
		( color ) => {
			onChange(
				setColors(
					value,
					name,
					colors,
					{ [ property ]: color },
					colorGradientSettings.gradients
				)
			);
		},
		[
			onChange,
			property,
			value,
			name,
			colors,
			colorGradientSettings.gradients,
		]
	);

	return (
		<GradientPicker
			value={ activeColors[ '--the-icon-gradient-color' ] }
			onChange={ onColorChange }
			gradients={ colorGradientSettings.gradients }
		/>
	);
}

export default function StyleInlineIconUI( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
} ) {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );
	const cachedRect = useCachedTruthy( popoverAnchor.getBoundingClientRect() );
	popoverAnchor.getBoundingClientRect = () => cachedRect;

	const colors = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const activeColors = useMemo(
		() => getActiveIcons( value, name, colors, gradientValues ),
		[ name, value, colors, gradientValues ]
	);

	return (
		<Popover
			onClose={ onClose }
			className="mone-icon-popover"
			anchor={ popoverAnchor }
		>
			<TabPanel
				className="mone-tab"
				activeClass="is-active"
				tabs={ [
					{
						name: 'iconColor',
						title: 'Color',
					},
					{
						name: 'iconGradientColor',
						title: 'GradientColor',
					},
					{
						name: 'size',
						title: 'size',
					},
				] }
				initialTabName={
					!! activeColors[ '--the-icon-gradient-color' ]
						? 'iconGradientColor'
						: 'iconColor'
				}
			>
				{ ( tab ) => {
					if ( 'iconColor' === tab.name ) {
						return (
							<div className="mone-popover-color-picker">
								<ColorPicker
									name={ name }
									property={ 'iconColor' }
									value={ value }
									onChange={ onChange }
								/>
							</div>
						);
					} else if ( 'iconGradientColor' === tab.name ) {
						return (
							<div className="mone-popover-color-picker">
								<GradientColorPicker
									name={ name }
									property={ 'iconGradientColor' }
									value={ value }
									onChange={ onChange }
								/>
							</div>
						);
					} else if ( 'size' === tab.name ) {
						return (
							<div className="mone-icon-tab-content">size</div>
						);
					}
				} }
			</TabPanel>
		</Popover>
	);
}
