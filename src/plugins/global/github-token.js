/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { Flex, FlexItem, TextControl, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';
import { eye, eyeClosed } from '../../icons';

export const GithubToken = () => {
	const { optionObj, githubAccessToken } = useSelect( ( select ) => {
		const { getOptions } = select( STORE_NAME );
		return {
			optionObj: getOptions(),
			githubAccessToken: getOptions().github_access_token || '',
		};
	}, [] );
	const { setOptions } = useDispatch( STORE_NAME );
	const [ type, setType ] = useState( 'password' );

	return (
		<>
			<Flex align="end">
				<FlexItem style={ { flexGrow: '1' } }>
					<TextControl
						className="mone__sidebar_text_control"
						__nextHasNoMarginBottom
						type={ type }
						label={ __( 'Githubトークン', 'mone' ) }
						value={ githubAccessToken }
						onChange={ ( value ) => {
							const newOptionObj = {
								...optionObj,
								github_access_token: value,
							};
							setOptions( newOptionObj );
						} }
					/>
				</FlexItem>
				<FlexItem>
					<Button
						onClick={ () =>
							setType(
								type === 'password' ? 'textarea' : 'password'
							)
						}
						style={ { padding: '0' } }
					>
						{ type === 'password' ? (
							<Icon icon={ eyeClosed } />
						) : (
							<Icon icon={ eye } />
						) }
					</Button>
				</FlexItem>
			</Flex>
		</>
	);
};
