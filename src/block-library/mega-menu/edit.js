import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	ComboboxControl,
	PanelBody,
	Button,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { addQueryArgs, safeDecodeURI } from '@wordpress/url';

export default function MegaMenuEdit( props ) {
	const { attributes, setAttributes } = props;
	const { label, menuSlug, megaMenuType, url, title, rel, linkTarget } =
		attributes;

	const blockProps = useBlockProps( {
		className: clsx( 'mone-mega-menu' ),
	} );

	const { hasResolved, records } = useEntityRecords(
		'postType',
		'wp_template_part',
		{ per_page: -1 }
	);

	let menuOptions = [];
	if ( hasResolved ) {
		menuOptions = records
			.filter( ( item ) => item.area === 'menu' )
			.map( ( item ) => ( {
				id: item.id,
				label: item.title.rendered,
				value: item.slug,
			} ) );
	}

	const editPartsUrl = ( postId ) => {
		return addQueryArgs( 'site-editor.php', {
			postId,
			postType: 'wp_template_part',
			canvas: 'edit',
		} );
	};

	const createPartsUrl = addQueryArgs( 'site-editor.php', {
		categoryId: 'menu',
		postType: 'wp_template_part',
	} );

	const getMenuOptionDetails = ( _menuSlug, _menuOptions ) => {
		const option = _menuOptions.find(
			( item ) => item.value === _menuSlug
		);
		if ( option ) {
			return {
				id: option.id,
				label: option.label,
			};
		}
		return null;
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) } initialOpen={ true }>
					<ComboboxControl
						label={ __( 'Menu Template', 'mone' ) }
						value={ menuSlug }
						options={ menuOptions }
						onChange={ ( slugValue ) =>
							setAttributes( { menuSlug: slugValue } )
						}
					/>
					{ menuSlug && (
						<Button
							variant="secondary"
							href={ editPartsUrl(
								getMenuOptionDetails( menuSlug, menuOptions )
									?.id
							) }
						>
							{
								getMenuOptionDetails( menuSlug, menuOptions )
									?.label
							}
							{ __( 'Edit', 'mone' ) }
						</Button>
					) }
					<Button
						variant="secondary"
						href={ createPartsUrl }
						style={ { marginBottom: '8px' } }
					>
						{ __( 'Create a template part', 'mone' ) }
					</Button>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Click to open', 'mone' ) }
						onChange={ ( value ) =>
							setAttributes( {
								megaMenuType: value ? undefined : 'hover',
							} )
						}
						checked={ megaMenuType === undefined }
					/>
					{ megaMenuType === 'hover' && (
						<>
							<TextControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								value={ url ? safeDecodeURI( url ) : '' }
								onChange={ ( urlValue ) => {
									setAttributes( { url: urlValue } );
								} }
								label={ __( 'Link' ) }
								autoComplete="off"
							/>
							{ url && (
								<>
									<ToggleControl
										__nextHasNoMarginBottom
										label={ __( 'Open in new tab' ) }
										onChange={ ( value ) =>
											setAttributes( {
												linkTarget: value
													? '_blank'
													: '_self',
											} )
										}
										checked={ linkTarget === '_blank' }
									/>
									<TextControl
										__nextHasNoMarginBottom
										label={ __( 'Link rel' ) }
										value={ rel }
										onChange={ ( newRel ) =>
											setAttributes( { rel: newRel } )
										}
									/>
								</>
							) }
							<TextControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								value={ title || '' }
								onChange={ ( titleValue ) => {
									setAttributes( { title: titleValue } );
								} }
								label={ __( 'Title attribute' ) }
								autoComplete="off"
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<RichText
					identifier="label"
					className="wp-block-navigation-item__label"
					value={ label }
					onChange={ ( labelValue ) =>
						setAttributes( {
							label: labelValue,
						} )
					}
					aria-label={ __( 'Mega menu link text', 'mone' ) }
					placeholder={ __( 'Mega menu label', 'mone' ) }
					allowedFormats={ [
						'core/bold',
						'core/italic',
						'core/image',
						'core/strikethrough',
						'mone/inline-icon',
					] }
				/>
			</div>
		</>
	);
}
