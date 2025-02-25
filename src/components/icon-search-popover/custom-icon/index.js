/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { TextareaControl, Button } from '@wordpress/components';
import { useEffect, useState, renderToString } from '@wordpress/element';
import { Icon } from '@wordpress/icons';

import { blockCategoryIcon } from '../../../icons';
import { parseIcon } from '../utils/parse-icon';
import { ReactIcon, isCustomIcon } from '../ReactIcon';

export const CustomIcon = ( { iconName, iconSVG, onChange } ) => {
	const [ preSvgIcon, setPreSvgIcon ] = useState( iconSVG );

	useEffect( () => {
		let svgContent;
		if ( ! isCustomIcon( iconName ) ) {
			svgContent = renderToString( <ReactIcon iconName={ iconName } /> );
		} else {
			svgContent = iconSVG;
		}
		setPreSvgIcon( svgContent );
	}, [ iconName, iconSVG ] );

	const iconParse = parseIcon( preSvgIcon );
	const isSVG = !! iconParse?.props;

	return (
		<>
			<div className="mone-icon-type-tab">
				<div className="mone-icon-tab-content--custom">
					{ isSVG ? (
						<div className="mone-preview-svg-icon">
							{ parseIcon( preSvgIcon ) }
						</div>
					) : (
						<div className="mone-preview-svg-icon default-icon">
							<Icon icon={ blockCategoryIcon } />
						</div>
					) }
					{ ! isSVG && (
						<div className="mone-preview-svg-text">
							{ __( 'Invalid SVG code', 'mone' ) }
						</div>
					) }
					<TextareaControl
						className="mone-preview-svg-textarea"
						__nextHasNoMarginBottom
						onChange={ ( value ) => {
							setPreSvgIcon( value );
						} }
						placeholder={ __( 'Svg code is here', 'mone' ) }
						value={ preSvgIcon }
					/>
					<div className="mone-preview-svg-button-area">
						<Button
							disabled={ ! isSVG && ! preSvgIcon }
							variant="primary"
							onClick={ () => {
								onChange( {
									iconType: 'custom',
									iconSVG: preSvgIcon,
								} );
							} }
						>
							{ __( 'Insert custom icon', 'mone' ) }
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};
