/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { Button, Placeholder } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';
import { useCopyToClipboard } from '@wordpress/compose';

const URLPlaceholder = ( {
	icon,
	label,
	value,
	onSubmit,
	onChange,
	cannotEmbed,
	fallback,
	tryAgain,
} ) => {
	const exampleUrl =
		'https://github.com/WordPress/gutenberg/blob/df98e3731b300c01a93d0900a59ffb1c60a3a0f3/gutenberg.php#L1-L5';

	return (
		<Placeholder
			icon={ <BlockIcon icon={ icon } showColors /> }
			label={ label }
			className="wp-block-embed"
			instructions={ __(
				'Paste the permalink of the Github code you want to display on your site.',
				'mone'
			) }
		>
			<form
				onSubmit={ onSubmit }
				style={ {
					flexWrap: 'nowrap',
				} }
			>
				<textarea
					type="url"
					value={ value || '' }
					className="components-placeholder__input"
					aria-label={ label }
					placeholder={ __( 'Enter URL to embed here…' ) }
					onChange={ onChange }
					style={ {
						fieldSizing: 'content',
					} }
				/>
				<Button variant="primary" type="submit">
					{ _x( 'Embed', 'button label' ) }
				</Button>
			</form>
			<p
				style={ {
					wordBreak: 'break-all',
					margin: '0',
				} }
			>
				{ __( 'example :', 'mone' ) }
				<a href={ exampleUrl } target="_blank">
					{ exampleUrl }
				</a>
			</p>
			{ cannotEmbed && (
				<div className="components-placeholder__error">
					<div className="components-placeholder__instructions">
						{ __( 'Sorry, this content could not be embedded.' ) }
					</div>
					<Button variant="secondary" onClick={ tryAgain }>
						{ _x( 'Try again', 'button label' ) }
					</Button>{ ' ' }
					<Button variant="secondary" onClick={ fallback }>
						{ _x( 'Convert to link', 'button label' ) }
					</Button>
				</div>
			) }
		</Placeholder>
	);
};

export default URLPlaceholder;
