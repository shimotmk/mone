import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@wordpress/components';
import { hasBlockSupport } from '@wordpress/blocks';

import {
	setClassName,
	existsClass,
	deleteClass,
} from '../../utils-func/class-name/classAttribute.js';

export const MediaQuery = ( props ) => {
	const {
		name,
		attributes: { className },
		setAttributes,
	} = props;
	const hasSupportCustomClassName = hasBlockSupport(
		name,
		'customClassName',
		true
	);
	if ( ! hasSupportCustomClassName ) {
		return null;
	}

	return (
		<>
			<ToolsPanelItem
				label={ __( 'Hide on PC', 'mone' ) }
				isShownByDefault={ false }
				hasValue={ () => existsClass( className, 'mone-pc-none' ) }
				onDeselect={ () => {
					deleteClass( 'mone-pc-none', className, setAttributes );
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
					checked={ existsClass( className, 'mone-pc-none' ) }
					onChange={ () =>
						setClassName( 'mone-pc-none', className, setAttributes )
					}
					__nextHasNoMarginBottom
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				label={ __( 'Hide on mobile', 'mone' ) }
				isShownByDefault={ false }
				hasValue={ () => existsClass( className, 'mone-sp-none' ) }
				onDeselect={ () => {
					deleteClass( 'mone-sp-none', className, setAttributes );
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
					checked={ existsClass( className, 'mone-sp-none' ) }
					onChange={ () =>
						setClassName( 'mone-sp-none', className, setAttributes )
					}
					__nextHasNoMarginBottom
				/>
			</ToolsPanelItem>
		</>
	);
};
