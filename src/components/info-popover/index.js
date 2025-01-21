/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { DropdownMenu, ExternalLink } from '@wordpress/components';
import { info } from '@wordpress/icons';

import './editor.scss';

export const InfoPopover = ( props ) => {
	const { message, link, position, popoverProps } = props;
	const popoverPosition = position ?? 'middle bottom';

	return (
		<div className="info-popover">
			<DropdownMenu
				label={ __( 'More Information', 'mone' ) }
				icon={ info }
				toggleProps={ {
					className: 'info-popover__button',
				} }
				popoverProps={ {
					className: 'info-popover__container',
					focusOnMount: 'container',
					position: popoverPosition,
					noArrow: false,
					...popoverProps,
				} }
			>
				{ () => (
					<>
						<p>{ message }</p>
						{ link && (
							<ExternalLink href={ link }>
								{ __( 'Learn More', 'mone' ) }
							</ExternalLink>
						) }
					</>
				) }
			</DropdownMenu>
		</div>
	);
};
