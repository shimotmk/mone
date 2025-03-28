/* eslint-disable */
/* http://prismjs.com/download.html?themes=prism-okaidia&languages=markup+css+clike+javascript+json+php+sql */
var _self =
		'undefined' != typeof window
			? window
			: 'undefined' != typeof WorkerGlobalScope &&
			  self instanceof WorkerGlobalScope
			? self
			: {},
	Prism = ( function () {
		var e = /\blang(?:uage)?-(\w+)\b/i,
			t = 0,
			n = ( _self.Prism = {
				util: {
					encode: function ( e ) {
						return e instanceof a
							? new a(
									e.type,
									n.util.encode( e.content ),
									e.alias
							  )
							: 'Array' === n.util.type( e )
							? e.map( n.util.encode )
							: e
									.replace( /&/g, '&amp;' )
									.replace( /</g, '&lt;' )
									.replace( /\u00a0/g, ' ' );
					},
					type: function ( e ) {
						return Object.prototype.toString
							.call( e )
							.match( /\[object (\w+)\]/ )[ 1 ];
					},
					objId: function ( e ) {
						return (
							e.__id ||
								Object.defineProperty( e, '__id', {
									value: ++t,
								} ),
							e.__id
						);
					},
					clone: function ( e ) {
						var t = n.util.type( e );
						switch ( t ) {
							case 'Object':
								var a = {};
								for ( var r in e )
									e.hasOwnProperty( r ) &&
										( a[ r ] = n.util.clone( e[ r ] ) );
								return a;
							case 'Array':
								return (
									e.map &&
									e.map( function ( e ) {
										return n.util.clone( e );
									} )
								);
						}
						return e;
					},
				},
				languages: {
					extend: function ( e, t ) {
						var a = n.util.clone( n.languages[ e ] );
						for ( var r in t ) a[ r ] = t[ r ];
						return a;
					},
					insertBefore: function ( e, t, a, r ) {
						r = r || n.languages;
						var i = r[ e ];
						if ( 2 == arguments.length ) {
							a = arguments[ 1 ];
							for ( var l in a )
								a.hasOwnProperty( l ) && ( i[ l ] = a[ l ] );
							return i;
						}
						var o = {};
						for ( var s in i )
							if ( i.hasOwnProperty( s ) ) {
								if ( s == t )
									for ( var l in a )
										a.hasOwnProperty( l ) &&
											( o[ l ] = a[ l ] );
								o[ s ] = i[ s ];
							}
						return (
							n.languages.DFS( n.languages, function ( t, n ) {
								n === r[ e ] && t != e && ( this[ t ] = o );
							} ),
							( r[ e ] = o )
						);
					},
					DFS: function ( e, t, a, r ) {
						r = r || {};
						for ( var i in e )
							e.hasOwnProperty( i ) &&
								( t.call( e, i, e[ i ], a || i ),
								'Object' !== n.util.type( e[ i ] ) ||
								r[ n.util.objId( e[ i ] ) ]
									? 'Array' !== n.util.type( e[ i ] ) ||
									  r[ n.util.objId( e[ i ] ) ] ||
									  ( ( r[ n.util.objId( e[ i ] ) ] = ! 0 ),
									  n.languages.DFS( e[ i ], t, i, r ) )
									: ( ( r[ n.util.objId( e[ i ] ) ] = ! 0 ),
									  n.languages.DFS( e[ i ], t, null, r ) ) );
					},
				},
				plugins: {},
				highlightAll: function ( e, t ) {
					var a = {
						callback: t,
						selector:
							'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
					};
					n.hooks.run( 'before-highlightall', a );
					for (
						var r,
							i =
								a.elements ||
								document.querySelectorAll( a.selector ),
							l = 0;
						( r = i[ l++ ] );

					)
						n.highlightElement( r, e === ! 0, a.callback );
				},
				highlightElement: function ( t, a, r ) {
					for ( var i, l, o = t; o && ! e.test( o.className );  )
						o = o.parentNode;
					o &&
						( ( i = ( o.className.match( e ) || [
							,
							'',
						] )[ 1 ].toLowerCase() ),
						( l = n.languages[ i ] ) ),
						( t.className =
							t.className
								.replace( e, '' )
								.replace( /\s+/g, ' ' ) +
							' language-' +
							i ),
						( o = t.parentNode ),
						/pre/i.test( o.nodeName ) &&
							( o.className =
								o.className
									.replace( e, '' )
									.replace( /\s+/g, ' ' ) +
								' language-' +
								i );
					var s = t.textContent,
						u = { element: t, language: i, grammar: l, code: s };
					if (
						( n.hooks.run( 'before-sanity-check', u ),
						! u.code || ! u.grammar )
					)
						return n.hooks.run( 'complete', u ), void 0;
					if (
						( n.hooks.run( 'before-highlight', u ),
						a && _self.Worker )
					) {
						var c = new Worker( n.filename );
						( c.onmessage = function ( e ) {
							( u.highlightedCode = e.data ),
								n.hooks.run( 'before-insert', u ),
								( u.element.innerHTML = u.highlightedCode ),
								r && r.call( u.element ),
								n.hooks.run( 'after-highlight', u ),
								n.hooks.run( 'complete', u );
						} ),
							c.postMessage(
								JSON.stringify( {
									language: u.language,
									code: u.code,
									immediateClose: ! 0,
								} )
							);
					} else
						( u.highlightedCode = n.highlight(
							u.code,
							u.grammar,
							u.language
						) ),
							n.hooks.run( 'before-insert', u ),
							( u.element.innerHTML = u.highlightedCode ),
							r && r.call( t ),
							n.hooks.run( 'after-highlight', u ),
							n.hooks.run( 'complete', u );
				},
				highlight: function ( e, t, r ) {
					var i = n.tokenize( e, t );
					return a.stringify( n.util.encode( i ), r );
				},
				tokenize: function ( e, t ) {
					var a = n.Token,
						r = [ e ],
						i = t.rest;
					if ( i ) {
						for ( var l in i ) t[ l ] = i[ l ];
						delete t.rest;
					}
					e: for ( var l in t )
						if ( t.hasOwnProperty( l ) && t[ l ] ) {
							var o = t[ l ];
							o = 'Array' === n.util.type( o ) ? o : [ o ];
							for ( var s = 0; s < o.length; ++s ) {
								var u = o[ s ],
									c = u.inside,
									g = !! u.lookbehind,
									h = !! u.greedy,
									f = 0,
									d = u.alias;
								if ( h && ! u.pattern.global ) {
									var p = u.pattern
										.toString()
										.match( /[imuy]*$/ )[ 0 ];
									u.pattern = RegExp(
										u.pattern.source,
										p + 'g'
									);
								}
								u = u.pattern || u;
								for (
									var m = 0, y = 0;
									m < r.length;
									y += ( r[ m ].matchedStr || r[ m ] ).length,
										++m
								) {
									var v = r[ m ];
									if ( r.length > e.length ) break e;
									if ( ! ( v instanceof a ) ) {
										u.lastIndex = 0;
										var b = u.exec( v ),
											k = 1;
										if ( ! b && h && m != r.length - 1 ) {
											if (
												( ( u.lastIndex = y ),
												( b = u.exec( e ) ),
												! b )
											)
												break;
											for (
												var w =
														b.index +
														( g
															? b[ 1 ].length
															: 0 ),
													_ = b.index + b[ 0 ].length,
													A = m,
													S = y,
													P = r.length;
												P > A && _ > S;
												++A
											)
												( S += (
													r[ A ].matchedStr || r[ A ]
												).length ),
													w >= S &&
														( ++m, ( y = S ) );
											if (
												r[ m ] instanceof a ||
												r[ A - 1 ].greedy
											)
												continue;
											( k = A - m ),
												( v = e.slice( y, S ) ),
												( b.index -= y );
										}
										if ( b ) {
											g && ( f = b[ 1 ].length );
											var w = b.index + f,
												b = b[ 0 ].slice( f ),
												_ = w + b.length,
												x = v.slice( 0, w ),
												O = v.slice( _ ),
												j = [ m, k ];
											x && j.push( x );
											var N = new a(
												l,
												c ? n.tokenize( b, c ) : b,
												d,
												b,
												h
											);
											j.push( N ),
												O && j.push( O ),
												Array.prototype.splice.apply(
													r,
													j
												);
										}
									}
								}
							}
						}
					return r;
				},
				hooks: {
					all: {},
					add: function ( e, t ) {
						var a = n.hooks.all;
						( a[ e ] = a[ e ] || [] ), a[ e ].push( t );
					},
					run: function ( e, t ) {
						var a = n.hooks.all[ e ];
						if ( a && a.length )
							for ( var r, i = 0; ( r = a[ i++ ] );  ) r( t );
					},
				},
			} ),
			a = ( n.Token = function ( e, t, n, a, r ) {
				( this.type = e ),
					( this.content = t ),
					( this.alias = n ),
					( this.matchedStr = a || null ),
					( this.greedy = !! r );
			} );
		if (
			( ( a.stringify = function ( e, t, r ) {
				if ( 'string' == typeof e ) return e;
				if ( 'Array' === n.util.type( e ) )
					return e
						.map( function ( n ) {
							return a.stringify( n, t, e );
						} )
						.join( '' );
				var i = {
					type: e.type,
					content: a.stringify( e.content, t, r ),
					tag: 'span',
					classes: [ 'token', e.type ],
					attributes: {},
					language: t,
					parent: r,
				};
				if (
					( 'comment' == i.type &&
						( i.attributes.spellcheck = 'true' ),
					e.alias )
				) {
					var l =
						'Array' === n.util.type( e.alias )
							? e.alias
							: [ e.alias ];
					Array.prototype.push.apply( i.classes, l );
				}
				n.hooks.run( 'wrap', i );
				var o = '';
				for ( var s in i.attributes )
					o +=
						( o ? ' ' : '' ) +
						s +
						'="' +
						( i.attributes[ s ] || '' ) +
						'"';
				return (
					'<' +
					i.tag +
					' class="' +
					i.classes.join( ' ' ) +
					'"' +
					( o ? ' ' + o : '' ) +
					'>' +
					i.content +
					'</' +
					i.tag +
					'>'
				);
			} ),
			! _self.document )
		)
			return _self.addEventListener
				? ( _self.addEventListener(
						'message',
						function ( e ) {
							var t = JSON.parse( e.data ),
								a = t.language,
								r = t.code,
								i = t.immediateClose;
							_self.postMessage(
								n.highlight( r, n.languages[ a ], a )
							),
								i && _self.close();
						},
						! 1
				  ),
				  _self.Prism )
				: _self.Prism;
		var r =
			document.currentScript ||
			[].slice.call( document.getElementsByTagName( 'script' ) ).pop();
		return (
			r &&
				( ( n.filename = r.src ),
				document.addEventListener &&
					! r.hasAttribute( 'data-manual' ) &&
					( 'loading' !== document.readyState
						? window.requestAnimationFrame
							? window.requestAnimationFrame( n.highlightAll )
							: window.setTimeout( n.highlightAll, 16 )
						: document.addEventListener(
								'DOMContentLoaded',
								n.highlightAll
						  ) ) ),
			_self.Prism
		);
	} )();
'undefined' != typeof module && module.exports && ( module.exports = Prism ),
	'undefined' != typeof global && ( global.Prism = Prism );
( Prism.languages.markup = {
	comment: /<!--[\w\W]*?-->/,
	prolog: /<\?[\w\W]+?\?>/,
	doctype: /<!DOCTYPE[\w\W]+?>/,
	cdata: /<!\[CDATA\[[\w\W]*?]]>/i,
	tag: {
		pattern:
			/<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			tag: {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: { punctuation: /[=>"']/ },
			},
			punctuation: /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: { namespace: /^[^\s>\/:]+:/ },
			},
		},
	},
	entity: /&#?[\da-z]{1,8};/i,
} ),
	Prism.hooks.add( 'wrap', function ( a ) {
		'entity' === a.type &&
			( a.attributes.title = a.content.replace( /&amp;/, '&' ) );
	} ),
	( Prism.languages.xml = Prism.languages.markup ),
	( Prism.languages.html = Prism.languages.markup ),
	( Prism.languages.mathml = Prism.languages.markup ),
	( Prism.languages.svg = Prism.languages.markup );
( Prism.languages.css = {
	comment: /\/\*[\w\W]*?\*\//,
	atrule: {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: { rule: /@[\w-]+/ },
	},
	url: /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	selector: /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	string: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
	property: /(\b|\B)[\w-]+(?=\s*:)/i,
	important: /\B!important\b/i,
	function: /[-a-z0-9]+(?=\()/i,
	punctuation: /[(){};:]/,
} ),
	( Prism.languages.css.atrule.inside.rest = Prism.util.clone(
		Prism.languages.css
	) ),
	Prism.languages.markup &&
		( Prism.languages.insertBefore( 'markup', 'tag', {
			style: {
				pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
				lookbehind: ! 0,
				inside: Prism.languages.css,
				alias: 'language-css',
			},
		} ),
		Prism.languages.insertBefore(
			'inside',
			'attr-value',
			{
				'style-attr': {
					pattern: /\s*style=("|').*?\1/i,
					inside: {
						'attr-name': {
							pattern: /^\s*style/i,
							inside: Prism.languages.markup.tag.inside,
						},
						punctuation: /^\s*=\s*['"]|['"]\s*$/,
						'attr-value': {
							pattern: /.+/i,
							inside: Prism.languages.css,
						},
					},
					alias: 'language-css',
				},
			},
			Prism.languages.markup.tag
		) );
Prism.languages.clike = {
	comment: [
		{ pattern: /(^|[^\\])\/\*[\w\W]*?\*\//, lookbehind: ! 0 },
		{ pattern: /(^|[^\\:])\/\/.*/, lookbehind: ! 0 },
	],
	string: {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: ! 0,
	},
	'class-name': {
		pattern:
			/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: ! 0,
		inside: { punctuation: /(\.|\\)/ },
	},
	keyword:
		/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	boolean: /\b(true|false)\b/,
	function: /[a-z0-9_]+(?=\()/i,
	number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	punctuation: /[{}[\];(),.:]/,
};
( Prism.languages.javascript = Prism.languages.extend( 'clike', {
	keyword:
		/\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	function: /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
	operator:
		/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/,
} ) ),
	Prism.languages.insertBefore( 'javascript', 'keyword', {
		regex: {
			pattern:
				/(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
			lookbehind: ! 0,
			greedy: ! 0,
		},
	} ),
	Prism.languages.insertBefore( 'javascript', 'string', {
		'template-string': {
			pattern: /`(?:\\\\|\\?[^\\])*?`/,
			greedy: ! 0,
			inside: {
				interpolation: {
					pattern: /\$\{[^}]+\}/,
					inside: {
						'interpolation-punctuation': {
							pattern: /^\$\{|\}$/,
							alias: 'punctuation',
						},
						rest: Prism.languages.javascript,
					},
				},
				string: /[\s\S]+/,
			},
		},
	} ),
	Prism.languages.markup &&
		Prism.languages.insertBefore( 'markup', 'tag', {
			script: {
				pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
				lookbehind: ! 0,
				inside: Prism.languages.javascript,
				alias: 'language-javascript',
			},
		} ),
	( Prism.languages.js = Prism.languages.javascript );
( Prism.languages.json = {
	property: /".*?"(?=\s*:)/gi,
	string: /"(?!:)(\\?[^"])*?"(?!:)/g,
	number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
	punctuation: /[{}[\]);,]/g,
	operator: /:/g,
	boolean: /\b(true|false)\b/gi,
	null: /\bnull\b/gi,
} ),
	( Prism.languages.jsonp = Prism.languages.json );
( Prism.languages.php = Prism.languages.extend( 'clike', {
	keyword:
		/\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
	constant: /\b[A-Z0-9_]{2,}\b/,
	comment: {
		pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
		lookbehind: ! 0,
		greedy: ! 0,
	},
} ) ),
	Prism.languages.insertBefore( 'php', 'class-name', {
		'shell-comment': {
			pattern: /(^|[^\\])#.*/,
			lookbehind: ! 0,
			alias: 'comment',
		},
	} ),
	Prism.languages.insertBefore( 'php', 'keyword', {
		delimiter: /\?>|<\?(?:php)?/i,
		variable: /\$\w+\b/i,
		package: {
			pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
			lookbehind: ! 0,
			inside: { punctuation: /\\/ },
		},
	} ),
	Prism.languages.insertBefore( 'php', 'operator', {
		property: { pattern: /(->)[\w]+/, lookbehind: ! 0 },
	} ),
	Prism.languages.markup &&
		( Prism.hooks.add( 'before-highlight', function ( e ) {
			'php' === e.language &&
				( ( e.tokenStack = [] ),
				( e.code = e.code.replace(
					/(?:<\?php|<\?)[\w\W]*?(?:\?>)/gi,
					function ( n ) {
						return (
							e.tokenStack.push( n ),
							'{{{PHP' + e.tokenStack.length + '}}}'
						);
					}
				) ) );
		} ),
		Prism.hooks.add( 'after-highlight', function ( e ) {
			if ( 'php' === e.language ) {
				for ( var n, a = 0; ( n = e.tokenStack[ a ] ); a++ )
					e.highlightedCode = e.highlightedCode.replace(
						'{{{PHP' + ( a + 1 ) + '}}}',
						Prism.highlight( n, e.grammar, 'php' ).replace(
							/\$/g,
							'$$$$'
						)
					);
				e.element.innerHTML = e.highlightedCode;
			}
		} ),
		Prism.hooks.add( 'wrap', function ( e ) {
			'php' === e.language &&
				'markup' === e.type &&
				( e.content = e.content.replace(
					/(\{\{\{PHP[0-9]+\}\}\})/g,
					'<span class="token php">$1</span>'
				) );
		} ),
		Prism.languages.insertBefore( 'php', 'comment', {
			markup: {
				pattern: /<[^?]\/?(.*?)>/,
				inside: Prism.languages.markup,
			},
			php: /\{\{\{PHP[0-9]+\}\}\}/,
		} ) );
Prism.languages.sql = {
	comment: {
		pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|(?:--|\/\/|#).*)/,
		lookbehind: ! 0,
	},
	string: { pattern: /(^|[^@\\])("|')(?:\\?[\s\S])*?\2/, lookbehind: ! 0 },
	variable: /@[\w.$]+|@("|'|`)(?:\\?[\s\S])+?\1/,
	function:
		/\b(?:COUNT|SUM|AVG|MIN|MAX|FIRST|LAST|UCASE|LCASE|MID|LEN|ROUND|NOW|FORMAT)(?=\s*\()/i,
	keyword:
		/\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR VARYING|CHARACTER (?:SET|VARYING)|CHARSET|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMN|COLUMNS|COMMENT|COMMIT|COMMITTED|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|DATA(?:BASES?)?|DATE(?:TIME)?|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITER(?:S)?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE(?: PRECISION)?|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE KEY|ELSE|ENABLE|ENCLOSED BY|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPE(?:D BY)?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTO|INVOKER|ISOLATION LEVEL|JOIN|KEYS?|KILL|LANGUAGE SQL|LAST|LEFT|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MODIFIES SQL DATA|MODIFY|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL(?: CHAR VARYING| CHARACTER(?: VARYING)?| VARCHAR)?|NATURAL|NCHAR(?: VARCHAR)?|NEXT|NO(?: SQL|CHECK|CYCLE)?|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READ(?:S SQL DATA|TEXT)?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEATABLE|REPLICATION|REQUIRE|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE MODE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|START(?:ING BY)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED BY|TEXT(?:SIZE)?|THEN|TIMESTAMP|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNPIVOT|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?)\b/i,
	boolean: /\b(?:TRUE|FALSE|NULL)\b/i,
	number: /\b-?(?:0x)?\d*\.?[\da-f]+\b/,
	operator:
		/[-+*\/=%^~]|&&?|\|?\||!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
	punctuation: /[;[\]()`,.]/,
};
