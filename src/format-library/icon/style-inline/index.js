/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
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

export function setAttributes(
	value,
	name,
	colorSettings,
	colors,
	gradientSettings,
	fontSizesSettings,
	newFontSize
) {
	const { iconColor, iconGradientColor, fontSize } = {
		...getActiveIcons( {
			value,
			name,
			colorSettings,
			colorGradientSettings: gradientSettings,
			fontSizesSettings,
		} ),
		...colors,
		fontSize: newFontSize,
	};
	const activeFormat = getActiveIcons( {
		value,
		name,
		colorSettings,
		colorGradientSettings: gradientSettings,
		fontSizesSettings,
	} );

	const styles = [];
	const classNames = [];
	const attributes = {};

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

	const gradientValues = gradientSettings
		?.map( ( setting ) => setting.gradients )
		.flat();
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

	if ( fontSize ) {
		const fontSizeSlug = getFontSizeObjectByValue(
			fontSizesSettings,
			fontSize
		);

		if ( fontSizeSlug?.slug ) {
			classNames.push( `has-${ fontSizeSlug.slug }-font-size` );
		} else {
			styles.push( [ 'font-size', fontSizeSlug.size ].join( ':' ) );
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

	const activeIcons = useMemo(
		() =>
			getActiveIcons( {
				value,
				name,
				colorSettings,
				colorGradientSettings: gradientValues,
				fontSizesSettings,
			} ),
		[ name, value, colorSettings, gradientValues, fontSizesSettings ]
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
									name={ name }
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
									value={ value }
									onChange={ onChange }
								/>
							</div>
						);
					} else if ( 'size' === tab.name ) {
						return (
							<div className="mone-popover-color-picker">
								<Size
									name={ name }
									value={ value }
									onChange={ onChange }
								/>
							</div>
						);
					}
				} }
			</TabPanel>
		</Popover>
	);
}
