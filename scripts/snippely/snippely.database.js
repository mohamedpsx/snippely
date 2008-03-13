Snippely.Database = new Class({
	
	initialize: function(){
		this.connection = new air.SQLConnection();
		this.connection.addEventListener(air.SQLEvent.OPEN, this.onOpen.bind(this));
		this.connection.addEventListener(air.SQLErrorEvent.ERROR, this.onError);
		
		this.dbFile = air.File.applicationStorageDirectory.resolvePath("application.db");
		this.connection.openAsync(this.dbFile);
	},
	
	create: function(){
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
			"  rank INTEGER, " +
			"  type TEXT, " +
			"  code INTEGER(1), " +
			"  content TEXT" +
			")";
		
		this.execute(tags);
		this.execute(snippets);
		this.execute(snips);
	},
	
	execute: function(sql, callback){
		callback = callback || $empty;
		
		var statement = new air.SQLStatement();
		statement.sqlConnection = this.connection;
		statement.text = sql;
		
		statement.addEventListener(air.SQLEvent.RESULT, function(){ callback(statement.getResult(), event); });
		statement.addEventListener(air.SQLErrorEvent.ERROR, this.onError);
		statement.execute();
	},
	
	// Callbacks
	
	onOpen: function(event){
		air.trace("database created / loaded");
		console.log('database created / loaded');
		//this.nuke();
		this.create();
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
