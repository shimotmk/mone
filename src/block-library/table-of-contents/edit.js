import clsx from 'clsx';

import { __ } from '@wordpress/i18n';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	HeightControl,
} from '@wordpress/block-editor';

export default function TableOfContentEdit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { maxHeight} = attributes;

	const paddingTop = attributes.style?.spacing?.padding?.top || '0';
	const paddingBottom = attributes.style?.spacing?.padding?.bottom || '0';

	let maxHeightVar = '';
	if ( maxHeight ) {
		maxHeightVar += `calc(${ maxHeight } - ${ paddingTop } - ${ paddingBottom })`;
	}

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-max-height` ]: maxHeight,
		} ),
		style: {
			'--the-max-height': maxHeightVar,
		},
	} );

	return (
		<>
			<InspectorControls group="dimensions">
				<ToolsPanelItem
					hasValue={ () => maxHeight !== undefined }
					label={ __( 'Max height', 'mone' ) }
					onDeselect={ () =>
						setAttributes( { maxHeight: undefined } )
					}
					isShownByDefault={ true }
					panelId={ clientId }
				>
					<HeightControl
						label={ __( 'Max height', 'mone' ) }
						value={ maxHeight }
						onChange={ ( value ) =>
							setAttributes( { maxHeight: value } )
						}
					/>
				</ToolsPanelItem>
			</InspectorControls>
			<div { ...blockProps }>
				<ol className="ol-depth-1">
					<li className="active">
						<a href="#pseudo-link">
							{ __(
								'目次エディター プレビュー H2見出し',
								'text-domain'
							) }
						</a>
						<ol className="ol-depth-2">
							<li>
								<a href="#pseudo-link">
									{ __(
										'目次エディター プレビュー H3見出し',
										'text-domain'
									) }
								</a>
							</li>
							<li>
								<a href="#pseudo-link">
									{ __(
										'目次エディター プレビュー H3見出し',
										'text-domain'
									) }
								</a>
							</li>
						</ol>
					</li>
					<li>
						<a href="#pseudo-link">
							{ __(
								'目次エディター プレビュー H2見出し',
								'text-domain'
							) }
						</a>
						<ol className="ol-depth-2">
							<li>
								<a href="#pseudo-link">
									{ __(
										'目次エディター プレビュー H3見出し',
										'text-domain'
									) }
								</a>
								<ol className="ol-depth-3">
									<li>
										<a href="#pseudo-link">
											{ __(
												'目次エディター プレビュー H4見出し',
												'text-domain'
											) }
										</a>
										<ol className="ol-depth-4">
											<li>
												<a href="#pseudo-link">
													{ __(
														'目次エディター プレビュー H5見出し',
														'text-domain'
													) }
												</a>
											</li>
										</ol>
									</li>
								</ol>
							</li>
						</ol>
					</li>
					<li>
						<a href="#pseudo-link">
							{ __(
								'目次エディター プレビュー H2見出し',
								'text-domain'
							) }
						</a>
						<ol className="ol-depth-2">
							<li>
								<a href="#pseudo-link">
									{ __(
										'目次エディター プレビュー H3見出し',
										'text-domain'
									) }
								</a>
							</li>
						</ol>
					</li>
				</ol>
			</div>
		</>
	);
}
