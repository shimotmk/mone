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
} from '@wordpress/block-editor';
import { Popover, TabPanel } from '@wordpress/components';
import {
	color as colorIcon,
	cog as cogIcon,
	background as backgroundIcon,
} from '@wordpress/icons';
import { parseWithAttributeSchema } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { inlineIconSettings as settings } from '../index';
import { getActiveIcons, parseCSS } from '../inline';
import { Background } from './background';
import { Border } from './border';
import { Color } from './color';
import { Settings } from './settings';
import { Size } from './size';
import { border as borderIcon, sizeMove as sizeMoveIcon } from '../../../icons';

function setAttributes( {
	value,
	name,
	colorSettings,
	gradientSettings,
	newValueObj,
	activeObjectAttributes,
} ) {
	const parsedStyles = parseCSS(
		activeObjectAttributes.style,
		colorSettings,
		gradientSettings
	);

	const {
		'--the-icon-color': iconColor,
		'--the-icon-gradient-color': iconGradientColor,
		'font-size': fontSize,
		className: attributesClassNames = '',
		...declaration
	} = {
		...parsedStyles,
		...newValueObj,
	};

	const styles = [];
	const attributes = {};
	let hasColor = false;

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
		hasColor = true;
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
		hasColor = true;
	}

	if ( styles.length ) {
		attributes.style = styles.length ? `${ styles.join( ';' ) };` : '';
	}

	if ( attributesClassNames ) {
		attributes.class = 'mone-inline-icon-wrapper ' + attributesClassNames;
	} else {
		attributes.class = 'mone-inline-icon-wrapper';
	}

	const innerHTMLWrapTag = parseWithAttributeSchema(
		value.replacements[ value.start ].innerHTML,
		{
			source: 'tag',
			selector: ':nth-child(1)',
		}
	);

	const svgHTML = parseWithAttributeSchema(
		value.replacements[ value.start ].innerHTML,
		{
			type: 'string',
			source: 'html',
			selector: '.mone-inline-icon-svg-wrapper',
		}
	);

	let newInnerHTML;
	if ( hasColor ) {
		if ( innerHTMLWrapTag === 'svg' ) {
			newInnerHTML =
				'<span class="mone-inline-icon-svg-wrapper">' +
				value.replacements[ value.start ].innerHTML +
				'</span>';
		} else {
			newInnerHTML = value.replacements[ value.start ].innerHTML;
		}
	} else if ( svgHTML ) {
		newInnerHTML = svgHTML;
	} else {
		newInnerHTML = value.replacements[ value.start ].innerHTML;
	}

	const newReplacements = value.replacements.slice();
	newReplacements[ value.start ] = {
		type: name,
		attributes: {
			style: attributes.style,
			class: attributes.class,
		},
		innerHTML: newInnerHTML,
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

	const activeIcons = useMemo(
		() =>
			getActiveIcons( {
				colorSettings,
				colorGradientSettings: gradientValues,
				activeObjectAttributes,
			} ),
		[ colorSettings, gradientValues, activeObjectAttributes ]
	);
	const onIconChange = ( newValueObj ) => {
		onChange(
			setAttributes( {
				value,
				name,
				colorSettings,
				gradientSettings: colorGradientSettings.gradients,
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
				className="mone-tab-head"
				activeClass="is-active"
				tabs={ [
					{
						name: 'iconColor',
						title: __( 'Color', 'mone' ),
						icon: colorIcon,
						className: 'mone-tab-button',
					},
					{
						name: 'background',
						title: __( 'Background', 'mone' ),
						icon: backgroundIcon,
						className: 'mone-tab-button',
					},
					{
						name: 'size',
						title: __( 'Size', 'mone' ),
						icon: sizeMoveIcon,
						className: 'mone-tab-button',
					},
					{
						name: 'iconBorder',
						title: __( 'Border', 'mone' ),
						icon: borderIcon,
						className: 'mone-tab-button',
					},
					{
						name: 'settings',
						title: __( 'Settings', 'mone' ),
						icon: cogIcon,
						className: 'mone-tab-button',
					},
				] }
				initialTabName={ 'iconColor' }
			>
				{ ( tab ) => {
					if ( 'iconColor' === tab.name ) {
						return (
							<Color
								activeIcons={ activeIcons }
								onIconChange={ onIconChange }
							/>
						);
					} else if ( 'background' === tab.name ) {
						return (
							<Background
								activeIcons={ activeIcons }
								onIconChange={ onIconChange }
							/>
						);
					} else if ( 'size' === tab.name ) {
						return (
							<Size
								activeIcons={ activeIcons }
								onIconChange={ onIconChange }
							/>
						);
					} else if ( 'iconBorder' === tab.name ) {
						return (
							<Border
								activeIcons={ activeIcons }
								onIconChange={ onIconChange }
							/>
						);
					} else if ( 'settings' === tab.name ) {
						return (
							<Settings
								activeIcons={ activeIcons }
								onIconChange={ onIconChange }
							/>
						);
					}
				} }
			</TabPanel>
		</Popover>
	);
}
