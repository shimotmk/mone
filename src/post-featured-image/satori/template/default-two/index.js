import { Element1 } from './element-1';

export const DefaultTwo = ( props ) => {
	const { postTitle, authorIconUrl, authorName, siteLogoUrl, siteTitle } =
		props;
	return (
		<>
			<Element1 { ...props }>
				<div
					style={ {
						width: '100%',
						height: '80%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					} }
				>
					<div
						style={ {
							fontSize: 60,
							display: 'block',
							textOverflow: 'ellipsis',
							lineClamp: 3,
							lineHeight: 1.5,
							textAlign: 'center',
						} }
					>
						{ postTitle }
					</div>
				</div>
				<div
					style={ {
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						height: '20%',
					} }
				>
					<div
						style={ {
							display: 'flex',
							alignItems: 'center',
							width: '60%',
							height: '100%',
						} }
					>
						{ authorIconUrl !== false && (
							<div
								style={ {
									display: 'flex',
								} }
							>
								{ /* eslint-disable-next-line jsx-a11y/alt-text */ }
								<img
									style={ {
										width: '90px',
										height: '90px',
										borderRadius: 100,
									} }
									src={ authorIconUrl }
								/>
							</div>
						) }
						<div
							style={ {
								fontSize: 40,
								display: 'block',
								textOverflow: 'ellipsis',
								lineClamp: 1,
								marginLeft: '20px',
							} }
						>
							{ authorName }
						</div>
					</div>
					<div
						style={ {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
							width: '40%',
							height: '100%',
						} }
					>
						{ siteLogoUrl !== false ? (
							<div
								style={ {
									display: 'flex',
								} }
							>
								{ /* eslint-disable-next-line jsx-a11y/alt-text */ }
								<img
									style={ {
										height: '100%',
										maxWidth: '100%',
									} }
									src={ siteLogoUrl }
								/>
							</div>
						) : (
							<div
								style={ {
									fontSize: 40,
									display: 'block',
									textOverflow: 'ellipsis',
									lineClamp: '1',
								} }
							>
								{ siteTitle }
							</div>
						) }
					</div>
				</div>
			</Element1>
		</>
	);
};
