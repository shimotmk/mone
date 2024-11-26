export const Element1 = ( {
	color,
	backgroundColor,
	borderRadius,
	border,
	backgroundImageUrl,
	gradientsColor,
	padding,
	children,
} ) => {
	return (
		<>
			<div
				className="mone-satori-element-1"
				style={ {
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					fontSize: 32,
					fontWeight: 600,
					...( backgroundColor && { backgroundColor } ),
					...( backgroundImageUrl &&
						gradientsColor && {
							backgroundImage: `url(${ backgroundImageUrl })`,
							backgroundRepeat: 'no-repeat',
						} ),
					...( !!! backgroundImageUrl &&
						gradientsColor && {
							backgroundImage: gradientsColor,
						} ),
					...( backgroundImageUrl &&
						!!! gradientsColor && {
							backgroundImage: `url(${ backgroundImageUrl })`,
							backgroundRepeat: 'no-repeat',
						} ),
					...( border?.width && { borderWidth: border.width } ),
					...( border?.color && { borderColor: border.color } ),
					...( borderRadius && { borderRadius } ),
					color: color ? color : '#000',
					...( padding ? { padding } : { padding: '32px' } ),
				} }
			>
				{ children }
			</div>
		</>
	);
};
