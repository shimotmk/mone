/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	ColorPalette,
} from '@wordpress/block-editor';
import { GradientPicker, TabPanel } from '@wordpress/components';

export function Color( { activeIcons, onIconChange } ) {
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
					!! activeIcons[ '--the-icon-gradient-color' ]
						? 'gradient'
						: 'color'
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
									value={ activeIcons[ '--the-icon-color' ] }
									onChange={ ( newValue ) => {
										onIconChange( {
											'--the-icon-color': newValue,
											'--the-icon-gradient-color':
												undefined,
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
									value={
										activeIcons[
											'--the-icon-gradient-color'
										]
									}
									onChange={ ( newValue ) => {
										onIconChange( {
											'--the-icon-color': undefined,
											'--the-icon-gradient-color':
												newValue,
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
