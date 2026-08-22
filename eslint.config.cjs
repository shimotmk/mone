const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	...defaultConfig,
	{
		rules: {
			'@wordpress/no-unsafe-wp-apis': 'off',
			'import/no-unresolved': 'off',
			'import/no-extraneous-dependencies': 'off',
		},
	},
];
