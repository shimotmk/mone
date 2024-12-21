import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	HeightControl,
} from '@wordpress/block-editor';

export default function TableOfContentEdit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { maxHeight } = attributes;

	const blockProps = useBlockProps( {
		className: clsx( 'mone-mega-menu' ),
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
							目次エディター プレビュー H2見出し
						</a>
						<ol className="ol-depth-2">
							<li>
								<a href="#pseudo-link">
									目次エディター プレビュー H3見出し
								</a>
							</li>
							<li>
								<a href="#pseudo-link">
									目次エディター プレビュー H3見出し
								</a>
							</li>
						</ol>
					</li>
					<li>
						<a href="#pseudo-link">
							目次エディター プレビュー H2見出し
						</a>
						<ol className="ol-depth-2">
							<li>
								<a href="#pseudo-link">
									目次エディター プレビュー H3見出し
								</a>
								<ol className="ol-depth-3">
									<li>
										<a href="#pseudo-link">
											目次エディター プレビュー H4見出し
										</a>
										<ol className="ol-depth-4">
											<li>
												<a href="#pseudo-link">
													目次エディター プレビュー
													H5見出し
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
							目次エディター プレビュー H2見出し
						</a>
						<ol className="ol-depth-2">
							<li>
								<a href="#pseudo-link">
									目次エディター プレビュー H3見出し
								</a>
							</li>
						</ol>
					</li>
				</ol>
			</div>
		</>
	);
}
	