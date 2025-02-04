/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { getBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
	arrowRight,
	arrowDown,
} from '@wordpress/icons';
import {
	Flex,
	FlexItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

const hasLayoutSupport = ( blockNameOrType ) => {
	const moneSupport = getBlockSupport( blockNameOrType, 'moneSatori' );
	const layoutSupport = moneSupport?.layout || false;
	return layoutSupport;
};

export const BlockEditSatori = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;

		if ( ! hasLayoutSupport( name ) ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<Flex>
						<FlexItem>
							<FlexLayoutJustifyContentControl
								attributes={ attributes.moneStyle || {} }
								onChange={ setAttributes }
							/>
						</FlexItem>
						<FlexItem>
							<OrientationControl
								attributes={ attributes.moneStyle || {} }
								onChange={ setAttributes }
							/>
						</FlexItem>
					</Flex>
				</InspectorControls>
			</>
		);
	}
);

addFilter(
	'editor.BlockEdit',
	'mone/editor/block-edit/satori/supports-layout',
	BlockEditSatori
);

function FlexLayoutJustifyContentControl( { attributes, onChange } ) {
	const { justifyContent = 'left', orientation = 'horizontal' } = attributes;
	const onJustificationChange = ( value ) => {
		onChange( {
			moneStyle: {
				...attributes.moneStyle,
				justifyContent: value,
			},
		} );
	};
	const allowedControls = [ 'left', 'center', 'right' ];
	if ( orientation === 'horizontal' ) {
		allowedControls.push( 'space-between' );
	} else {
		allowedControls.push( 'stretch' );
	}

	const justificationOptions = [
		{
			value: 'left',
			icon: justifyLeft,
			label: __( 'Justify items left' ),
		},
		{
			value: 'center',
			icon: justifyCenter,
			label: __( 'Justify items center' ),
		},
		{
			value: 'right',
			icon: justifyRight,
			label: __( 'Justify items right' ),
		},
		{
			value: 'space-between',
			icon: justifySpaceBetween,
			label: __( 'Space between items' ),
		},
	];

	return (
		<ToggleGroupControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Justification' ) }
			value={ justifyContent }
			onChange={ onJustificationChange }
			className="block-editor-hooks__flex-layout-justification-controls"
		>
			{ justificationOptions.map( ( { value, icon, label } ) => {
				return (
					<ToggleGroupControlOptionIcon
						key={ value }
						value={ value }
						icon={ icon }
						label={ label }
					/>
				);
			} ) }
		</ToggleGroupControl>
	);
}

function OrientationControl( { attributes, onChange } ) {
	const {
		orientation = 'horizontal',
		verticalAlignment,
		justifyContent,
	} = attributes;
	return (
		<ToggleGroupControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			className="block-editor-hooks__flex-layout-orientation-controls"
			label={ __( 'Orientation' ) }
			value={ orientation }
			onChange={ ( value ) => {
				// Make sure the vertical alignment and justification are compatible with the new orientation.
				let newVerticalAlignment = verticalAlignment;
				let newJustification = justifyContent;
				if ( value === 'horizontal' ) {
					if ( verticalAlignment === 'space-between' ) {
						newVerticalAlignment = 'center';
					}
					if ( justifyContent === 'stretch' ) {
						newJustification = 'left';
					}
				} else {
					if ( verticalAlignment === 'stretch' ) {
						newVerticalAlignment = 'top';
					}
					if ( justifyContent === 'space-between' ) {
						newJustification = 'left';
					}
				}
				return onChange( {
					moneStyle: {
						...attributes.moneStyle,
						orientation: value,
						verticalAlignment: newVerticalAlignment,
						justifyContent: newJustification,
					},
				} );
			} }
		>
			<ToggleGroupControlOptionIcon
				icon={ arrowRight }
				value="horizontal"
				label={ __( 'Horizontal' ) }
			/>
			<ToggleGroupControlOptionIcon
				icon={ arrowDown }
				value="vertical"
				label={ __( 'Vertical' ) }
			/>
		</ToggleGroupControl>
	);
}
