import { store as coreBlockStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export const useThemeData = () => {
	return useSelect( ( select ) => {
		return {
			colorSet: select( coreBlockStore ).getSettings().colors,
			currentTheme: select( coreStore ).getCurrentTheme(),
		};
	}, [] );
};
