/**
 * External dependencies
 */
import parse, { attributesToProps, domToReact } from 'html-react-parser';

/**
 * Parse the icon sting into a React object.
 *
 * @param {string} icon The HTML icon.
 * @return {Object}     The icons as a React object.
 */
export function parseIcon( icon ) {
	const newIcon = icon.trim();

	const parseOptions = {
		trim: true,
		replace: ( { attribs, children, name, parent, type } ) => {
			if ( type === 'text' && parent && parent.name === 'text' ) {
				return;
			}

			if (
				( type !== 'tag' && type !== 'style' ) ||
				( ! parent && name !== 'svg' ) ||
				! name
			) {
				return <></>;
			}

			const Tag = `${ name }`;

			if ( type === 'style' && name === 'style' && children ) {
				if ( children[ 0 ]?.data ) {
					return (
						<Tag { ...attributesToProps( attribs ) }>
							{ children[ 0 ].data }
						</Tag>
					);
				}
				return <></>;
			}

			if ( name === 'button' && parent && parent.name === 'button' ) {
				return <></>;
			}

			return (
				<Tag { ...attributesToProps( attribs ) }>
					{ domToReact( children, parseOptions ) }
				</Tag>
			);
		},
	};

	return parse( newIcon, parseOptions );
}
