/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { TextareaControl, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';

import { blockCategoryIcon } from '../../../icons';

export const CustomIcon = ( { iconSVG, onChange } ) => {
	const [ preSvgIcon, setPreSvgIcon ] = useState( iconSVG );

	return (
		<>
			<div className="mone-icon-type-tab">
				<div className="mone-icon-tab-content">
					{ preSvgIcon ? (
						<div
							className="mone-preview-svg-icon"
							dangerouslySetInnerHTML={ {
								__html: preSvgIcon,
							} }
						/>
					) : (
						<Icon
							className="mone-preview-svg-icon"
							icon={ blockCategoryIcon }
						/>
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
				</div>
				<Button
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
		</>
	);
};
