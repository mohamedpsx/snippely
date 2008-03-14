Brushes.JavaScript = {
	
	'comment': [Highlighter.RegExps.singleLineComment, Highlighter.RegExps.multiLineComment],
	
	'string': [Highlighter.RegExps.singleQuotedString, Highlighter.RegExps.doubleQuotedString],
	
	'preprocessor': (/^\s*#.*/gm),
	
	'integer': (/\b(\d+)\b/gm),
	
	'boolean': ['true', 'false', 'null'],
	
	'special': ['this'],
	
	'keyword': [
		'abstract', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue',
		'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum', 'export', 'extends',
		'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in',
		'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected',
		'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'throw', 'throws',
		'transient', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'prototype'
	]

};