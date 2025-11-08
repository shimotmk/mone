/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Snackbar } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { STORE_NAME, API_PATH } from '../../store/constants';

export const SaveButton = ( { disabled, selectedThumbnailId } ) => {
	const [ isSaveSuccess, setIsSaveSuccess ] = useState( null );
	const [ isBusy, setIsBusy ] = useState( false );
	const { optionObj } = useSelect( ( select ) => {
		const { getOptions } = select( STORE_NAME );
		return {
			optionObj: getOptions(),
		};
	}, [] );
	const { setOptions } = useDispatch( STORE_NAME );

	const updateSettings = () => {
		setIsBusy( true );

		const updatedVariation = {
			...optionObj.thumbnail_template_variation_lists[
				selectedThumbnailId
			],
		};

		// 新しいvariationリストを作成
		const updatedVariationList =
			optionObj.thumbnail_template_variation_lists.map(
				( item, index ) =>
					index === selectedThumbnailId ? updatedVariation : item
			);

		// 新しいoptionObjを作成
		const newOptionObj = {
			...optionObj,
			thumbnail_template_variation_lists: updatedVariationList,
		};

		apiFetch( {
			path: API_PATH,
			method: 'POST',
			data: newOptionObj,
		} )
			.then( ( res ) => {
				setIsBusy( false );
				setIsSaveSuccess( __( 'Changes saved', 'mone' ) );
				// オプションを更新
				setOptions( newOptionObj );
				return res;
			} )
			.catch( ( error ) => {
				// エラーが発生した場合の処理
				setIsSaveSuccess( error.message );
				setIsBusy( false );
				throw error;
			} );
	};

	useEffect( () => {
		if ( isSaveSuccess !== null ) {
			setTimeout( () => {
				setIsSaveSuccess( null );
			}, 3000 );
		}
	}, [ isSaveSuccess ] );

	const { registerShortcut } = useDispatch( keyboardShortcutsStore );

	useEffect( () => {
		registerShortcut( {
			name: 'mone/custom-thumbnail/save',
			category: 'global',
			description: __( 'Featured Template:Save Changes', 'mone' ),
			keyCombination: {
				modifier: 'primary',
				character: 's',
			},
		} );
	}, [ registerShortcut ] );

	useShortcut( 'mone/custom-thumbnail/save', () => updateSettings() );

	return (
		<>
			<div>
				{ isSaveSuccess !== null && (
					<div
						style={ {
							position: 'fixed',
							bottom: '0.75em',
							left: '0.75em',
						} }
					>
						<Snackbar>{ isSaveSuccess }</Snackbar>
					</div>
				) }
				<Button
					disabled={ disabled }
					onClick={ updateSettings }
					variant="primary"
					isBusy={ isBusy }
				>
					{ isBusy ? __( 'Saving' ) : __( 'Save' ) }
				</Button>
			</div>
		</>
	);
};
