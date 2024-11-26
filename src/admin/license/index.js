import { __ } from '@wordpress/i18n';
import {
	TextControl,
	Button,
	Snackbar,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useCopyToClipboard } from '@wordpress/compose';
/* global moneAdminData */

export const LicenseKeyForm = () => {
	const [ email, setEmail ] = useState(
		moneAdminData.activateOption.mone_user_email || ''
	);
	const [ isSaving, setIsSaving ] = useState( false );
	const [ isSaveSuccess, setIsSaveSuccess ] = useState( null );
	const [ isCopySuccess, setIsCopySuccess ] = useState( null );

	const saveLicenseKey = () => {
		setIsSaving( true );
		apiFetch( {
			path: 'mone/v1/license-key',
			method: 'POST',
			data: { mone_user_email: email },
		} )
			.then( () => {
				setIsSaving( false );
				setIsSaveSuccess(
					__( 'user email saved successfully', 'mone' )
				);
			} )
			.catch( () => {
				setIsSaving( false );
				setIsSaveSuccess(
					__(
						'An error occurred while saving the user email.',
						'mone'
					)
				);
			} );
	};

	useEffect( () => {
		if ( isSaveSuccess !== null ) {
			const timer = setTimeout( () => {
				setIsSaveSuccess( null );
			}, 3000 );
			return () => clearTimeout( timer );
		}
		if ( isCopySuccess !== null ) {
			const timer = setTimeout( () => {
				setIsCopySuccess( null );
			}, 3000 );
			return () => clearTimeout( timer );
		}
	}, [ isSaveSuccess, isCopySuccess ] );

	function onSuccess() {
		setIsCopySuccess( true );
	}
	const ref = useCopyToClipboard( moneAdminData.licenseCheckUrl, onSuccess );

	return (
		<>
			<div className="wrap mone-activate-admin-wrap">
				<h1>{ __( 'Mone Activation Settings', 'mone' ) }</h1>

				<div className="step">
					<div className="step_wrap">
						<div className="step_title">
							<span className="step_circle"></span>
							<span className="step_num">
								{ __( 'Step 1', 'mone' ) }
							</span>
						</div>
						<div className="step_text">
							<p className="step_text-title">
								{ __(
									'Register the domain you want to authenticate on your Mone My Page',
									'mone'
								) }
							</p>
							<div className="step_text-txt">
								<p>
									<a
										href="https://mone-wp.com/mypage/"
										target="_blank"
										rel="noreferrer"
									>
										{ __( 'Mone Mypage', 'mone' ) }
									</a>
									{ __(
										'Please register the following domains',
										'mone'
									) }
								</p>
								<div className="domain_text">
									<input
										className="domain"
										type="text"
										value={ moneAdminData.licenseCheckUrl }
										disabled
									/>
									<Button
										__next40pxDefaultSize
										variant="secondary"
										ref={ ref }
										className="copy-button"
									>
										{ isCopySuccess ? (
											<span className="copied">
												{ __( 'Copied!', 'mone' ) }
											</span>
										) : (
											__( 'Copy', 'mone' )
										) }
									</Button>
								</div>
							</div>
						</div>
						<span className="step_line"></span>
					</div>

					<div className="step_wrap">
						<div className="step_title">
							<span className="step_circle"></span>
							<span className="step_num">
								{ __( 'Step 2', 'mone' ) }
							</span>
						</div>
						<div className="step_text">
							<p className="step_text-title">
								{ __(
									'Mone user Enter your email address',
									'mone'
								) }
							</p>
							<div className="step_text-txt">
								<p>
									{ __(
										'Enter your Mone user email address below and save',
										'mone'
									) }
								</p>
								<Flex justify="start">
									<FlexItem>
										<TextControl
											className="mone_activate_email"
											name="mone_activate_option[mone_user_email]"
											type="email"
											value={ email }
											onChange={ ( value ) =>
												setEmail( value )
											}
											required
											__nextHasNoMarginBottom
										/>
									</FlexItem>
									<FlexItem>
										<Button
											variant="primary"
											isBusy={ isSaving }
											onClick={ saveLicenseKey }
										>
											{ __( 'Save', 'mone' ) }
										</Button>
									</FlexItem>
								</Flex>
							</div>
						</div>
						<span className="step_line"></span>
					</div>

					<div className="step_wrap">
						<div className="step_title">
							<span className="step_circle"></span>
							<span className="step_num">
								{ __( 'Step 3', 'mone' ) }
							</span>
						</div>
						<div className="step_text">
							<p className="step_text-title">
								{ __( 'Authentication Check', 'mone' ) }
							</p>
							<div className="step_text-txt">
								<p>
									{ __(
										'If you press the button below and no alert appears, authentication is complete.',
										'mone'
									) }
								</p>
								<Button
									variant="secondary"
									href={ moneAdminData.forceUpdateUrl }
								>
									{ __( 'Check authentication', 'mone' ) }
								</Button>
							</div>
						</div>
						<span className="step_line"></span>
					</div>
				</div>
				{ isSaveSuccess && <Snackbar>{ isSaveSuccess }</Snackbar> }
			</div>
		</>
	);
};
