const defaultConfig = require( '@wordpress/scripts/config/.eslintrc.js' );

module.exports = {
	...defaultConfig,
	globals: {
		...defaultConfig.globals,
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
			},
		},
	},
	rules: {
		...defaultConfig.rules,
		'@wordpress/no-unsafe-wp-apis': 'off',
	},
};
