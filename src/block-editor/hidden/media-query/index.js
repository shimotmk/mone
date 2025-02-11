import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@wordpress/components';

import {
	toggleClass,
	deleteClass,
} from '../../../utils-func/class-name/classAttribute.js';
import { existsClassName } from '../../../utils-func/class-name';

export const MediaQuery = ( props ) => {
	const {
		attributes: { className },
		setAttributes,
	} = props;

	return (
		<>
			<ToolsPanelItem
				label={ __( 'Media Query', 'mone' ) }
				isShownByDefault={ false }
				hasValue={ () => existsClassName( 'mone-pc-none', className ) }
				onDeselect={ () => {
					deleteClass(
						[ 'mone-pc-none', 'mone-sp-none' ],
						className,
						setAttributes
					);
				} }
				resetAllFilter={ () => {
					deleteClass(
						[ 'mone-pc-none', 'mone-sp-none' ],
						className,
						setAttributes
					);
				} }
			>
				<ToggleControl
					label={ __( 'Hide on PC', 'mone' ) }
					checked={ existsClassName( 'mone-pc-none', className ) }
					onChange={ () =>
						toggleClass( 'mone-pc-none', className, setAttributes )
					}
					__nextHasNoMarginBottom
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				label={ __( 'Media Query', 'mone' ) }
				isShownByDefault={ false }
				hasValue={ () => existsClassName( 'mone-sp-none', className ) }
				onDeselect={ () => {
					deleteClass(
						[ 'mone-pc-none', 'mone-sp-none' ],
						className,
						setAttributes
					);
				} }
				resetAllFilter={ () => {
					deleteClass(
						[ 'mone-pc-none', 'mone-sp-none' ],
						className,
						setAttributes
					);
				} }
			>
				<ToggleControl
					label={ __( 'Hide on mobile', 'mone' ) }
					checked={ existsClassName( 'mone-sp-none', className ) }
					onChange={ () =>
						toggleClass( 'mone-sp-none', className, setAttributes )
					}
					__nextHasNoMarginBottom
				/>
			</ToolsPanelItem>
		</>
	);
};
