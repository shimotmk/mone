/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

export const PostAuthorIcon = ( props ) => {
	const { authorIconUrl, style, attributes } = props;
	// console.log("attributes",attributes);

	return (
		<>
			{ authorIconUrl !== false ? (
				<div
					style={ {
						...style,
						...( attributes?.width && {
							width: attributes?.width,
						} ),
						...( attributes?.height && {
							height: attributes?.height,
						} ),
					} }
				>
					{ /* eslint-disable-next-line jsx-a11y/alt-text */ }
					<img
						style={ {
							height: '100%',
							maxWidth: '100%',
							objectFit: 'cover',
							...( attributes?.moneStyle?.border?.width && {
								borderWidth:
									attributes?.moneStyle?.border?.width,
							} ),
							...( attributes?.moneStyle?.border?.color && {
								borderColor: attributes?.moneStyle.border.color,
							} ),
							...( attributes?.moneStyle?.borderRadius && {
								borderRadius:
									attributes?.moneStyle.borderRadius,
							} ),
						} }
						src={ authorIconUrl }
					/>
				</div>
			) : (
				<div
					style={ {
						display: 'flex',
					} }
				>
					{ __( 'Icon not found', 'mone' ) }
				</div>
			) }
		</>
	);
};

export default function Edit( props ) {
	const {
		attributes: { height, width },
		setAttributes,
	} = props;
	const blockProps = useBlockProps( {
		style: {
			display: 'flex',
		},
	} );

	const units = useCustomUnits( {
		availableUnits: [ '%', 'px', 'em', 'rem' ],
	} );

	const onDimensionChange = ( dimension, nextValue ) => {
		const parsedValue = parseFloat( nextValue );
		if ( isNaN( parsedValue ) && nextValue ) {
			return;
		}
		setAttributes( {
			[ dimension ]: parsedValue < 0 ? '0' : nextValue,
		} );
	};

	return (
		<>
			<InspectorControls group="dimensions">
				<ToolsPanelItem
					hasValue={ () => !! height }
					label={ __( 'Height' ) }
					onDeselect={ () => setAttributes( { height: undefined } ) }
					resetAllFilter={ () => ( {
						height: undefined,
					} ) }
					isShownByDefault={ true }
				>
					<UnitControl
						label={ __( 'Height' ) }
						labelPosition="top"
						value={ height || '' }
						min={ 0 }
						onChange={ ( nextHeight ) =>
							onDimensionChange( 'height', nextHeight )
						}
						units={ units }
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					className="single-column"
					hasValue={ () => !! width }
					label={ __( 'Width' ) }
					onDeselect={ () => setAttributes( { width: undefined } ) }
					resetAllFilter={ () => ( {
						width: undefined,
					} ) }
					isShownByDefault={ true }
				>
					<UnitControl
						label={ __( 'Width' ) }
						labelPosition="top"
						value={ width || '' }
						min={ 0 }
						onChange={ ( nextWidth ) =>
							onDimensionChange( 'width', nextWidth )
						}
						units={ units }
					/>
				</ToolsPanelItem>
			</InspectorControls>
			<div { ...blockProps }>{ __( 'Icon', 'mone' ) }</div>
		</>
	);
}
