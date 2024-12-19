import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

export default function TableOfContentEdit( props ) {
	const { attributes, setAttributes } = props;
	const { label } = attributes;

	const blockProps = useBlockProps( {
		className: clsx( 'mone-mega-menu' ),
	} );

	return (
		<>
			<InspectorControls></InspectorControls>
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
