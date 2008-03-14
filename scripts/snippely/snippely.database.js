Snippely.Database = new Class({
	
	Implements: [Events, Options],
	
	options: {/*
		onOpen: $empty,
		onError: $empty,*/
		filename: 'application.db'
	},
	
	initialize: function(options){
		this.setOptions(options);
		
		this.connection = new air.SQLConnection();
		this.connection.addEventListener('open', this.onOpen.bind(this));
		this.connection.addEventListener('error', this.onError);
		
		this.dbFile = air.File.applicationStorageDirectory.resolvePath(this.options.filename);
		this.connection.openAsync(this.dbFile);
	},
	
	create: function(callback){
		var tags =
			"CREATE TABLE IF NOT EXISTS tags (" +
			"  id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"  name TEXT" +
			")";
		
		var snippets =
			"CREATE TABLE IF NOT EXISTS snippets (" +
			"  id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"  tag_id INTEGER, " +
			"  title TEXT, " +
			"  description TEXT" +
			")";
		
		var snips =
			"CREATE TABLE IF NOT EXISTS snips (" +
			"  id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"  snippet_id INTEGER, " +
			"  position INTEGER, " +
			"  type TEXT, " +
			"  content TEXT" +
			")";
		
		var session = 
			"CREATE TABLE IF NOT EXISTS session (" +
			"  id TEXT PRIMARY KEY, " +
			"  tag_id INTEGER, " +
			"  snippet_id INTEGER" +
			")";
			
		var self = this;
		var queries = [tags, snippets, snips];
		(function(){
			self.execute(queries.shift(), (queries.length ? arguments.callee : callback));
		})();
	},
	
	execute: function(){
		var args = Array.link(arguments, {sql: String.type, callback: Function.type, params: Object.type});
		
		var sql = args.sql;
		var callback = args.callback || $empty;
		var params = args.params || {};
		
		var statement = new air.SQLStatement();
		statement.sqlConnection = this.connection;
		statement.text = sql;
		
		$each(params, function(value, key){
			statement.parameters[":" + key] = value;
		});
		
		statement.addEventListener(air.SQLEvent.RESULT, function(){ callback(statement.getResult(), event); });
		statement.addEventListener(air.SQLErrorEvent.ERROR, this.onError);
		statement.execute();
	},
	
	// Callbacks
	
	onOpen: function(event){
		air.trace("database created / loaded");
		console.log('database created / loaded');
		
		this.create(this.fireEvent.bind(this, 'onOpen'));
	},
	
	onError: function(event){
		air.trace("Error message:", event.error.message);
		air.trace("Details:", event.error.details);
	},
	
	// Nuke the database
	
	nuke: function(){
		['tags', 'snippets', 'snips'].each(function(table){
			this.execute("DROP TABLE " + table);
		}, this);
	}
	
});