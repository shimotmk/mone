/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useAnchor } from '@wordpress/rich-text';
import {
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
import { getActiveIcons, parseCSS } from '../inline';
import { ColorPicker } from './color';
import { GradientColorPicker } from './gradient-picker';
import { Settings } from './settings';
import {
	stringToArrayClassName,
	deleteRegExClassName,
} from '../../../utils-func/class-name/classAttribute';

function setAttributes( {
	value,
	name,
	colorSettings,
	gradientSettings,
	fontSizesSettings,
	newValueObj,
	activeObjectAttributes,
} ) {
	const parsedStyles = parseCSS( activeObjectAttributes.style );

	const {
		'--the-icon-color': iconColor,
		'--the-icon-gradient-color': iconGradientColor,
		'font-size': fontSize,
		...declaration
	} = {
		...getActiveIcons( {
			colorSettings,
			colorGradientSettings: gradientSettings,
			fontSettings: fontSizesSettings,
		} ),
		...parsedStyles,
		...newValueObj,
	};

	const styles = [];
	let classNames = [];
	const attributes = {};

	if ( activeObjectAttributes?.class ) {
		classNames = stringToArrayClassName( activeObjectAttributes.class );
	}

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
		classNames = stringToArrayClassName(
			deleteRegExClassName( /has-.*-font-size/, classNames )
		);

		const fontSizeSlug = getFontSizeObjectByValue(
			fontSizesSettings,
			fontSize
		);

		if ( fontSizeSlug?.slug ) {
			classNames.push( `has-${ fontSizeSlug.slug }-font-size` );
		} else {
			styles.push( `font-size: ${ fontSizeSlug.size }` );
		}
	} else {
		classNames = stringToArrayClassName(
			deleteRegExClassName( /has-.*-font-size/, classNames )
		);
	}

	if ( styles.length ) {
		attributes.style = styles.join( ';' );
	}
	if ( classNames.length ) {
		attributes.class = classNames.join( ' ' );
	}

	const newReplacements = value.replacements.slice();
	newReplacements[ value.start ] = {
		type: name,
		attributes: {
			style: attributes.style,
			class: attributes.class,
		},
		innerHTML: value.replacements[ value.start ].innerHTML,
	};
	const returnObj = {
		...value,
		replacements: newReplacements,
	};

	return returnObj;
}

export default function StyleInlineIconUI( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
	activeObjectAttributes,
} ) {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );

	const colorSettings = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().colors ?? [];
	}, [] );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const gradientValues = colorGradientSettings.gradients
		.map( ( setting ) => setting.gradients )
		.flat();
	const [ fontSizes ] = useSettings( 'typography.fontSizes' );

	const activeIcons = useMemo(
		() =>
			getActiveIcons( {
				colorSettings,
				colorGradientSettings: gradientValues,
				fontSettings: fontSizes,
				activeObjectAttributes,
			} ),
		[ colorSettings, gradientValues, fontSizes, activeObjectAttributes ]
	);
	const onIconChange = ( newValueObj ) => {
		onChange(
			setAttributes( {
				value,
				name,
				colorSettings,
				gradientSettings: colorGradientSettings.gradients,
				fontSizesSettings: fontSizes,
				newValueObj,
				activeObjectAttributes,
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
						name: 'settings',
						title: __( 'Settings', 'mone' ),
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
					} else if ( 'settings' === tab.name ) {
						return (
							<div className="mone-popover-color-picker">
								<Settings
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
