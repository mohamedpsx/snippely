Brushes.Ruby = {
	
	'comment': Highlighter.RegExps.singleLinePerlComments,
	
	'string': [Highlighter.RegExps.singleQuotedString, Highlighter.RegExps.doubleQuotedString],
	
	'integer': Highlighter.RegExps.integer,
	
	'preprocessor': Highlighter.RegExps.preprocessor,
	
	'symbol': (/:[a-z][A-Za-z0-9_]*/g),
	
	'variable': (/(\$|@@|@)\w+/g),
	
	'keyword': 'alias and BEGIN begin break case class def define_method defined do each else elsif ' +
		'END end ensure false for if in module new next nil not or raise redo rescue retry return ' +
		'self super then throw true undef unless until when while yield',

  	'special': 'Array Bignum Binding Class Continuation Dir Exception FalseClass File::Stat File Fixnum Fload ' +
		'Hash Integer IO MatchData Method Module NilClass Numeric Object Proc Range Regexp String Struct::TMS Symbol ' +
		'ThreadGroup Thread Time TrueClass'
	
};