/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { applyFormat, useAnchor } from '@wordpress/rich-text';
import {
	useCachedTruthy,
	store as blockEditorStore,
	getColorObjectByColorValue,
	__experimentalGetGradientObjectByGradientValue,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	getFontSizeObjectByValue,
	useSettings,
} from '@wordpress/block-editor';
import { Popover, TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { inlineIconSettings as settings } from '../index';
import { getActiveIcons } from '../inline';
import { ColorPicker } from './color';
import { GradientColorPicker } from './gradient-picker';
import { Size } from './size';

export function setAttributes( {
	value,
	name,
	colorSettings,
	gradientSettings,
	fontSizesSettings,
	newValueObj,
} ) {
	const {
		'--the-icon-color': iconColor,
		'--the-icon-gradient-color': iconGradientColor,
		'font-size': fontSize,
		...declaration
	} = {
		...getActiveIcons( {
			value,
			name,
			colorSettings,
			colorGradientSettings: gradientSettings,
			fontSizesSettings,
		} ),
		...newValueObj,
	};

	const styles = [];
	const classNames = [];
	const attributes = {};

	Object.entries( declaration ).forEach( ( [ property, _value ] ) => {
		if ( _value ) {
			styles.push( `${ property }:${ _value }` );
		}
	} );

	if ( iconColor ) {
		const colorObject = getColorObjectByColorValue(
			colorSettings,
			iconColor
		);
		if ( colorObject ) {
			styles.push(
				`--the-icon-color:var(--wp--preset--color--${ colorObject.slug })`
			);
		} else {
			styles.push( `--the-icon-color:${ iconColor }` );
		}
	}

	if ( iconGradientColor ) {
		const gradientObject = __experimentalGetGradientObjectByGradientValue(
			gradientSettings,
			iconGradientColor
		);
		const gradient = gradientObject
			? `var(--wp--preset--gradient--${ gradientObject.slug })`
			: iconGradientColor;
		styles.push( `--the-icon-gradient-color:${ gradient }` );
	}

	if ( fontSize ) {
		const fontSizeSlug = getFontSizeObjectByValue(
			fontSizesSettings,
			fontSize
		);

		if ( fontSizeSlug?.slug ) {
			classNames.push( `has-${ fontSizeSlug.slug }-font-size` );
		} else {
			styles.push( `font-size: ${ fontSizeSlug.size }` );
		}
	}

	if ( styles.length ) {
		attributes.style = styles.join( ';' );
	}
	if ( classNames.length ) {
		attributes.class = classNames.join( ' ' );
	}

	return applyFormat( value, { type: name, attributes } );
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

	const colorSettings = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const [ fontSizesSettings ] = useSettings( 'typography.fontSizes' );

	const activeIcons = getActiveIcons( {
		value,
		name,
		colorSettings,
		colorGradientSettings: gradientValues,
		fontSizesSettings,
	} );
	const onIconChange = ( newValueObj ) => {
		onChange(
			setAttributes( {
				value,
				name,
				colorSettings,
				gradientSettings: colorGradientSettings.gradients,
				fontSizesSettings,
				newValueObj,
			} )
		);
	};

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
						title: __( 'Color', 'mone' ),
					},
					{
						name: 'iconGradientColor',
						title: __( 'Gradient', 'mone' ),
					},
					{
						name: 'size',
						title: __( 'Size', 'mone' ),
					},
				] }
				initialTabName={
					!! activeIcons[ '--the-icon-gradient-color' ]
						? 'iconGradientColor'
						: 'iconColor'
				}
			>
				{ ( tab ) => {
					if ( 'iconColor' === tab.name ) {
						return (
							<div className="mone-popover-color-picker">
								<ColorPicker
									activeIcons={ activeIcons }
									onIconChange={ onIconChange }
								/>
							</div>
						);
					} else if ( 'iconGradientColor' === tab.name ) {
						return (
							<div className="mone-popover-color-picker">
								<GradientColorPicker
									activeIcons={ activeIcons }
									onIconChange={ onIconChange }
								/>
							</div>
						);
					} else if ( 'size' === tab.name ) {
						return (
							<div className="mone-popover-color-picker">
								<Size
									activeIcons={ activeIcons }
									onIconChange={ onIconChange }
								/>
							</div>
						);
					}
				} }
			</TabPanel>
		</Popover>
	);
}
