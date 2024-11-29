export const linearGradientColorToDefSvg = ( gradient, id ) => {
	if ( ! gradient ) {
		return null;
	}

	const gradientRegex = /linear-gradient\((\d+)deg,(.+)\)/;
	const colorStopRegex = /(rgba?\(.+?\)) (\d+)%/g;

	const matches = gradient.match( gradientRegex );
	if ( ! matches ) {
		return null;
	}

	const angle = matches[ 1 ];
	const colorStops = matches[ 2 ];

	const stopTags = [];
	let colorMatch;
	while ( ( colorMatch = colorStopRegex.exec( colorStops ) ) !== null ) {
		const color = colorMatch[ 1 ];
		const offset = colorMatch[ 2 ];
		stopTags.push(
			<stop
				key={ offset }
				offset={ `${ offset }%` }
				stopColor={ color }
			/>
		);
	}

	return (
		<svg
			style={ { visibility: 'hidden', height: 0, position: 'absolute' } }
		>
			<defs>
				<linearGradient
					id={ id }
					x1="0%"
					y1="0%"
					x2="100%"
					y2="0%"
					gradientTransform={ `rotate(${ angle })` }
				>
					{ stopTags }
				</linearGradient>
			</defs>
		</svg>
	);
};
