/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	ColorPalette,
} from '@wordpress/block-editor';
import { GradientPicker, TabPanel } from '@wordpress/components';

export function Background( { activeIcons, onIconChange } ) {
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<>
			<TabPanel
				className="mone-tab"
				activeClass="is-active"
				tabs={ [
					{
						name: 'color',
						title: __( 'Color' ),
					},
					{
						name: 'gradient',
						title: __( 'Gradient', 'mone' ),
					},
				] }
				initialTabName={
					!! activeIcons.background ? 'gradient' : 'color'
				}
			>
				{ ( tab ) => {
					if ( 'color' === tab.name ) {
						return (
							<div
								style={ {
									padding: '8px 0',
								} }
							>
								<ColorPalette
									value={ activeIcons[ 'background-color' ] }
									onChange={ ( newValue ) => {
										onIconChange( {
											'background-color': newValue,
											background: undefined,
										} );
									} }
									clearable={ true }
									enableAlpha={ true }
								/>
							</div>
						);
					} else if ( 'gradient' === tab.name ) {
						return (
							<div
								style={ {
									padding: '8px 0',
								} }
							>
								<GradientPicker
									value={ activeIcons.background }
									onChange={ ( newValue ) => {
										onIconChange( {
											'background-color': undefined,
											background: newValue,
										} );
									} }
									gradients={
										colorGradientSettings.gradients
									}
								/>
							</div>
						);
					}
				} }
			</TabPanel>
		</>
	);
}
