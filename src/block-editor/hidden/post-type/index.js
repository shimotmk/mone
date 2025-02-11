import { __, sprintf } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import { usePostTypes } from './utils/use-post-types.js';
import {
	toggleClass,
	deleteClass,
} from '../../../utils-func/class-name/classAttribute.js';
import { existsClassName } from '../../../utils-func/class-name';

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
								existsClassName(
									`mone-post-type-${ postType.value }-none`,
									className
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
								checked={ existsClassName(
									`mone-post-type-${ postType.value }-none`,
									className
								) }
								onChange={ () =>
									toggleClass(
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
