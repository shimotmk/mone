/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useAnchor } from '@wordpress/rich-text';
import {
	store as blockEditorStore,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { Popover, TabPanel } from '@wordpress/components';
import {
	color as colorIcon,
	cog as cogIcon,
	background as backgroundIcon,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { inlineIconSettings as settings } from '../index';
import { getActiveIcons } from '../inline';
import { Background } from './background';
import { Border } from './border';
import { Color } from './color';
import { Settings } from './settings';
import { Size } from './size';
import { border as borderIcon, sizeMove as sizeMoveIcon } from '../../../icons';
import { setAttributes } from './set-attributes';

export const restButtonStyle = {
	fontSize: '11px',
	fontWeight: 500,
	lineHeight: 1.4,
	marginLeft: 'calc(12px)',
	textTransform: 'uppercase',
};

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
