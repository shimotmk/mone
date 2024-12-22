import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@wordpress/components';

import {
	setClassName,
	existsClass,
	deleteClass,
} from '../../../utils-func/class-name/classAttribute.js';

export const Toc = ( props ) => {
	const {
		attributes: { className },
		setAttributes,
	} = props;

	return (
		<>
			<ToolsPanelItem
				label={ __( 'Table Of Contents', 'mone' ) }
				isShownByDefault={ false }
				hasValue={ () => existsClass( className, 'mone-toc-none' ) }
				onDeselect={ () => {
					deleteClass( 'mone-toc-none', className, setAttributes );
				} }
				resetAllFilter={ () => {
					deleteClass( 'mone-toc-none', className, setAttributes );
				} }
			>
				<ToggleControl
					label={ __( 'Hide if no table of contents', 'mone' ) }
					checked={ existsClass( className, 'mone-toc-none' ) }
					onChange={ () =>
						setClassName(
							'mone-toc-none',
							className,
							setAttributes
						)
					}
					__nextHasNoMarginBottom
				/>
			</ToolsPanelItem>
		</>
	);
};
