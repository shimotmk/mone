/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import { seen, unseen } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	toggleClass,
	deleteClass,
} from '../../../utils-func/class-name/classAttribute.js';
import {
	existsClassName,
	deleteClassName,
} from '../../../utils-func/class-name';

export const Dialog = ( props ) => {
	const { name, attributes, setAttributes } = props;
	if ( name !== 'core/group' ) {
		return null;
	}

	const { className } = attributes;
	const hideDialogButtonClassName = 'mone-hide-dialog-button';

	return (
		<>
			{ existsClassName( 'mone-dialog-trigger', className ) && (
				<ToolsPanelItem
					label={ __( 'Dialog button', 'mone' ) }
					isShownByDefault
					hasValue={ () =>
						!! existsClassName(
							className,
							hideDialogButtonClassName
						)
					}
					onDeselect={ () => {
						deleteClass(
							hideDialogButtonClassName,
							className,
							setAttributes
						);
					} }
				>
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Dialog button', 'mone' ) }
						value={
							existsClassName(
								className,
								'mone-hide-dialog-button'
							)
								? 'hide'
								: 'show'
						}
						onChange={ ( value ) => {
							const newClassName =
								value === 'hide'
									? `mone-hide-dialog-button`
									: '';
							toggleClass(
								newClassName,
								deleteClassName(
									hideDialogButtonClassName,
									className
								),
								setAttributes
							);
						} }
					>
						<ToggleGroupControlOptionIcon
							label={ __( 'Show', 'mone' ) }
							value="show"
							icon={ seen }
						/>
						<ToggleGroupControlOptionIcon
							label={ __( 'Hide', 'mone' ) }
							value="hide"
							icon={ unseen }
						/>
					</ToggleGroupControl>
				</ToolsPanelItem>
			) }
		</>
	);
};
