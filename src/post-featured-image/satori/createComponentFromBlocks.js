import { getCustomValueFromPreset } from '@wordpress/block-editor';

import { Wrapper } from '../blocks/wrapper/edit';
import { Group } from '../blocks/group/edit';
import { PostTitle } from '../blocks/post-title/edit';
import { SiteLogo } from '../blocks/site-logo/edit';
import { SiteTitle } from '../blocks/site-title/edit';
import { PostAuthorName } from '../blocks/post-author-name/edit';
import { PostAuthorIcon } from '../blocks/post-author-icon/edit';

const getWrapStyle = ( moneStyle, name ) => {
	const spacingSizes = [
		{ name: 0, slug: '0', size: 0 },
		{ name: 1, slug: '10', size: '8px' },
		{ name: 2, slug: '30', size: '16px' },
		{ name: 3, slug: '40', size: '24px' },
		{ name: 4, slug: '50', size: '32px' },
		{ name: 5, slug: '60', size: '40px' },
		{ name: 6, slug: '70', size: '48px' },
		{ name: 7, slug: '80', size: '56px' },
	];
	const monePadding = moneStyle?.padding || {
		top: '0',
		right: '0',
		bottom: '0',
		left: '0',
	};
	const paddingValues = [ 'top', 'right', 'bottom', 'left' ].map(
		( side ) =>
			getCustomValueFromPreset( monePadding?.[ side ], spacingSizes ) ||
			'0'
	);
	const paddingVariables = paddingValues.join( ' ' );

	const moneGap = moneStyle?.blockGap || {
		all: '0',
	};
	const gapValues = [ 'all' ].map(
		( side ) =>
			getCustomValueFromPreset( moneGap?.[ side ], spacingSizes ) || '0'
	);
	const gapVariables = gapValues.join( ' ' );

	return {
		display: 'flex',
		...( moneStyle?.textColor && {
			color: moneStyle?.textColor,
		} ),
		...( moneStyle?.backgroundColor && {
			backgroundColor: moneStyle?.backgroundColor,
		} ),
		...( moneStyle?.backgroundImageUrl &&
			moneStyle?.backgroundGradient && {
				backgroundImage: `url(${ moneStyle.backgroundImageUrl })`,
				backgroundRepeat: 'no-repeat',
			} ),
		...( ! moneStyle?.backgroundImageUrl &&
			moneStyle?.backgroundGradient && {
				backgroundImage: moneStyle.backgroundGradient,
			} ),
		...( moneStyle?.backgroundImageUrl &&
			! moneStyle?.backgroundGradient && {
				backgroundImage: `url(${ moneStyle.backgroundImageUrl })`,
				backgroundRepeat: 'no-repeat',
			} ),
		...( name !== 'mone/satori-site-logo' &&
			name !== 'mone/satori-post-author-icon' && {
				...( moneStyle?.border?.width && {
					borderWidth: moneStyle.border.width,
				} ),
				...( moneStyle?.border?.color && {
					borderColor: moneStyle.border.color,
				} ),
				...( moneStyle?.borderRadius && {
					borderRadius: moneStyle.borderRadius,
				} ),
			} ),
		...( paddingVariables && {
			padding: paddingVariables,
		} ),
		...( moneStyle?.orientation &&
			moneStyle.orientation === 'horizontal' && {
				flexDirection: 'row',
			} ),
		...( moneStyle?.orientation &&
			moneStyle.orientation === 'vertical' && {
				flexDirection: 'column',
			} ),
		...( moneStyle?.justifyContent &&
			moneStyle.justifyContent === 'left' && {
				justifyContent: 'flex-start',
			} ),
		...( moneStyle?.justifyContent &&
			moneStyle.justifyContent === 'center' && {
				justifyContent: 'center',
			} ),
		...( moneStyle?.justifyContent &&
			moneStyle.justifyContent === 'right' && {
				justifyContent: 'flex-end',
			} ),
		...( moneStyle?.justifyContent &&
			moneStyle.justifyContent === 'space-between' && {
				justifyContent: 'space-between',
			} ),
		...( gapVariables && {
			gap: gapVariables,
		} ),
	};
};

export const renderInnerBlocks = ( innerBlocks, renderProps ) => {
	const { postTitle, siteTitle, siteLogoUrl, authorName, authorIconUrl } =
		renderProps;

	return innerBlocks.map( ( block, index ) => {
		const { name, attributes, innerBlocks: childBlocks } = block;
		const { moneStyle } = attributes || {};

		const wrapStyle = getWrapStyle( moneStyle, name );

		// 必要に応じてブロック名に基づいて異なるコンポーネントをレンダリング
		let BlockComponent;
		switch ( name ) {
			case 'mone/satori-group':
				BlockComponent = (
					<Group
						style={ wrapStyle }
						key={ index }
						attributes={ attributes }
					>
						{ childBlocks &&
							childBlocks.length > 0 &&
							renderInnerBlocks( childBlocks, renderProps ) }
					</Group>
				);
				break;
			case 'mone/satori-post-author-icon':
				BlockComponent = (
					<PostAuthorIcon
						style={ wrapStyle }
						authorIconUrl={ authorIconUrl }
						key={ index }
						attributes={ attributes }
					/>
				);
				break;
			case 'mone/satori-post-title':
				BlockComponent = (
					<PostTitle
						style={ wrapStyle }
						postTitle={ postTitle }
						key={ index }
						attributes={ attributes }
					/>
				);
				break;
			case 'mone/satori-post-author-name':
				BlockComponent = (
					<PostAuthorName
						style={ wrapStyle }
						authorName={ authorName }
						key={ index }
						attributes={ attributes }
					/>
				);
				break;
			case 'mone/satori-site-logo':
				BlockComponent = (
					<SiteLogo
						style={ wrapStyle }
						siteLogoUrl={ siteLogoUrl }
						key={ index }
					/>
				);
				break;
			case 'mone/satori-site-title':
				BlockComponent = (
					<SiteTitle
						style={ wrapStyle }
						siteTitle={ siteTitle }
						key={ index }
						attributes={ attributes }
					/>
				);
				break;
		}

		return BlockComponent;
	} );
};

export const createComponentFromBlocks = ( props ) => {
	const { blocks, ...renderProps } = props;

	const { attributes } = blocks;
	const { moneStyle } = attributes;

	const wrapStyle = {
		...getWrapStyle( moneStyle ),
		height: '100%',
		width: '100%',
		// display: 'flex',
		// flexDirection: 'column',
		// justifyContent: 'center',
		fontSize: 32,
		fontWeight: 600,
	};

	return (
		<Wrapper style={ wrapStyle }>
			{ renderInnerBlocks( blocks.innerBlocks, renderProps ) }
		</Wrapper>
	);
};
