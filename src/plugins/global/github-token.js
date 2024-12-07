/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { Flex, FlexItem, TextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';

export const GithubToken = () => {
	const { optionObj, githubAccessToken } = useSelect(
		( select ) => {
			const { getOptions } = select( STORE_NAME );
			return {
				optionObj: getOptions(),
				githubAccessToken: getOptions().github_access_token || '',
			};
		},
		[]
	);
	const { setOptions } = useDispatch( STORE_NAME );

	return (
		<>
			<Flex direction="column">
				<FlexItem>
					<TextControl
						className="mone__sidebar_text_control"
						__nextHasNoMarginBottom
						type="text"
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
			</Flex>
		</>
	);
};
