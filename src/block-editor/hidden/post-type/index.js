import { __, sprintf } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import { usePostTypes } from './utils/use-post-types.js';
import {
	setClassName,
	existsClass,
	deleteClass,
} from '../../../utils-func/class-name/classAttribute.js';

export const PostType = ( props ) => {
	const {
		attributes: { className },
		setAttributes,
	} = props;

	const postTypes = usePostTypes();
	const postTypeValues = postTypes.map(
		( postType ) => `mone-post-type-${ postType.value }-none`
	);

	return (
		<>
			{ postTypes.map( ( postType ) => {
				return (
					<Fragment key={ postType.value }>
						<ToolsPanelItem
							label={ __( 'Post Type', 'mone' ) }
							isShownByDefault={ false }
							hasValue={ () =>
								existsClass(
									className,
									`mone-post-type-${ postType.value }-none`
								)
							}
							onDeselect={ () => {
								deleteClass(
									postTypeValues,
									className,
									setAttributes
								);
							} }
							resetAllFilter={ () => {
								deleteClass(
									postTypeValues,
									className,
									setAttributes
								);
							} }
						>
							<ToggleControl
								label={ sprintf(
									/* translators: Hide on %s */
									__( 'Hide on %s', 'mone' ),
									postType.label
								) }
								checked={ existsClass(
									className,
									`mone-post-type-${ postType.value }-none`
								) }
								onChange={ () =>
									setClassName(
										`mone-post-type-${ postType.value }-none`,
										className,
										setAttributes
									)
								}
								__nextHasNoMarginBottom
							/>
						</ToolsPanelItem>
					</Fragment>
				);
			} ) }
		</>
	);
};
