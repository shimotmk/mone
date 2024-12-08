/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	BlockControls,
	useSettings,
} from '@wordpress/block-editor';
import {
	Button,
	ToolbarGroup,
	ToolbarButton,
	Spinner,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { edit } from '@wordpress/icons';
import { View } from '@wordpress/primitives';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import useRemoteUrlData from '../api/use-rich-url-data';
import fetchUrlData from '../api/fetch-url-data';
import URLPlaceholder from './url-placeholder';
import { githubIcon } from '../../../icons';
import { GithubToken } from './github-token';

export default function Edit( props ) {
	const { attributes, setAttributes, onFocus } = props;
	const { url: attributesUrl, height } = attributes;
	const [ isEditingURL, setIsEditingURL ] = useState( false );
	const [ url, setURL ] = useState( attributesUrl );
	const [ isLoadingClearCache, setIsLoadingClearCache ] = useState( false );

	const [ spacingUnits ] = useSettings( 'spacing.units' );
	const availableUnits = spacingUnits
		? spacingUnits.filter( ( unit ) => unit !== '%' )
		: [ 'px', 'em', 'rem', 'vw', 'vh' ];

	const units = useCustomUnits( {
		availableUnits,
		defaultValues: { px: 100, em: 10, rem: 10, vw: 10, vh: 25 },
	} );

	const blockProps = useBlockProps();
	const { richData, isFetching } = useRemoteUrlData(
		attributesUrl,
		isLoadingClearCache
	);
	const cannotEmbed = richData === null ? false : richData?.data.cannot_embed;
	const preview = richData === null ? false : ! richData?.data.cannot_embed;

	const onClickClearCache = () => {
		setIsLoadingClearCache( true );
		fetchUrlData( url, { clearCache: true } ).then( () => {
			setIsLoadingClearCache( false );
		} );
	};

	const codeSnippet = richData?.data.code
		? richData?.data.code
				.map( ( line ) => decodeEntities( line ) )
				.join( '\n' )
		: false;

	const range = ( start, end ) => {
		const length = end - start + 1;
		return Array.from( { length }, ( _, i ) => start + i );
	};

	return (
		<>
			<BlockControls>
				{ preview && ! cannotEmbed && ! isEditingURL && (
					<ToolbarGroup>
						<ToolbarButton
							className="components-toolbar__control"
							label={ __( 'Edit URL' ) }
							icon={ edit }
							onClick={ () => setIsEditingURL( true ) }
						/>
					</ToolbarGroup>
				) }
			</BlockControls>
			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							height: undefined,
						} );
					} }
				>
					<ToolsPanelItem
						label={ __( 'Height', 'mone' ) }
						isShownByDefault
						hasValue={ () =>
							height !== undefined ? true : false
						}
						onDeselect={ () =>
							setAttributes( {
								height: undefined,
							} )
						}
					>
						<View
							className="tools-panel-item-spacing"
							style={ { marginBottom: '16px' } }
						>
							<UnitControl
								onChange={ ( value ) => {
									setAttributes( {
										height: value ? value : undefined,
									} );
								} }
								value={ height }
								units={ units }
								label={ __( 'Height', 'mone' ) }
								size="__unstable-large"
							/>
						</View>
						{ richData?.data.post_id === undefined && (
							<>
								<Button
									onClick={ onClickClearCache }
									variant="primary"
									isBusy={ isLoadingClearCache }
									disabled={
										!!! attributesUrl ? true : false
									}
								>
									{ __( 'Clear cache', 'mone' ) }
								</Button>
								<p style={ { margin: '8px 0 0 0' } }>
									{ __(
										'If the data is old, please clear the cache. It is usually updated every day.',
										'mone'
									) }
								</p>
							</>
						) }
						<GithubToken />
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			{ ( () => {
				if ( isFetching || isLoadingClearCache ) {
					return (
						<View { ...blockProps }>
							<div className="wp-block-embed wp-block-github-embed is-loading">
								<Spinner />
							</div>
						</View>
					);
				} else if (
					url &&
					attributesUrl &&
					! isEditingURL &&
					! richData?.data.cannot_embed
				) {
					return (
						<div { ...blockProps }>
							<div className="embed-github-head-meta">
								<div className="embed-github-head-meta_icon">
									{ githubIcon }
								</div>

								<div className="embed-github-head-meta_body">
									<p className="embed-github-head-meta_url">
										<a
											href="#embed-github-pseudo-link"
											target="_blank"
											onClick={ ( event ) =>
												event.preventDefault()
											}
										>
											{ richData?.data.extract_path }
										</a>
									</p>
									<p className="embed-github-head-meta_line">
										Lines { richData?.data.start_line } to
										{ richData?.data.end_line }
										in
										{ richData?.data.branch_short }
									</p>
								</div>
							</div>

							<pre
								className="embed-github-pre"
								style={ {
									height: height ? height : undefined,
								} }
							>
								<div className="embed-github-line-numbers">
									{ range(
										richData?.data.start_line,
										richData?.data.end_line
									)?.map( ( lineNumber ) => (
										<span key={ lineNumber }>
											{ lineNumber }
										</span>
									) ) }
								</div>
								<code className="embed-github-code prism-code hljs">
									{ codeSnippet }
								</code>
							</pre>
						</div>
					);
				}
				return (
					<div { ...blockProps }>
						<URLPlaceholder
							icon={ githubIcon }
							label={ __( 'GitHub Code Embed', 'mone' ) }
							onFocus={ onFocus }
							onSubmit={ ( event ) => {
								if ( event ) {
									event.preventDefault();
								}
								if ( !! url ) {
									setIsEditingURL( false );
									setAttributes( { url } );
								}
							} }
							value={ url }
							cannotEmbed={ cannotEmbed }
							onChange={ ( event ) => {
								setURL( event.target.value );
							} }
							tryAgain={ onClickClearCache }
						/>
					</div>
				);
			} )() }
		</>
	);
}
