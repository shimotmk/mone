import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { displayTitle, title } = attributes;

	return (
		<div { ...useBlockProps.save() }>
			{ displayTitle && (
				<RichText.Content
					className="mone-toc__title"
					tagName="div"
					value={ title }
				/>
			) }

			<div className="mone-toc__content">
				<div className="contents-outline"></div>
			</div>
		</div>
	);
}
