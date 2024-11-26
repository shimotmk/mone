/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, BaseControl, SelectControl } from '@wordpress/components';

const TEMPLATE = [
	[
		'core/buttons',
		{},
		[
			[
				'core/button',
				{
					text: __( 'Variation Name', 'mone' ),
					tagName: 'button',
					type: 'submit',
				},
			],
		],
	],
];

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { styleVariations } = attributes;
	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: 'all',
	} );

	const VariationOption = [
		{ label: __( 'Current', 'mone' ), value: '' },
		{ label: __( 'Mone Default', 'mone' ), value: 'default' },
		{ label: __( 'Blue', 'mone' ), value: 'blue' },
		{ label: __( 'Dark', 'mone' ), value: 'dark' },
		{ label: __( 'Green', 'mone' ), value: 'green' },
		{ label: __( 'White', 'mone' ), value: 'white' },
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<BaseControl __nextHasNoMarginBottom>
						<SelectControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'VariationOption', 'mone' ) }
							options={ VariationOption }
							value={ styleVariations || '' }
							onChange={ ( value ) => {
								setAttributes( {
									styleVariations: value ? value : undefined,
								} );
							} }
						/>
					</BaseControl>
				</PanelBody>
			</InspectorControls>
			<li { ...blockProps }>
				<div { ...innerBlocksProps } />
			</li>
		</>
	);
}
