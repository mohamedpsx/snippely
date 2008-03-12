Snippely.Database = new Class({
	
	initialize: function(){
		this.connection = new air.SQLConnection();
		this.connection.addEventListener(air.SQLEvent.OPEN, this.onOpen);
		this.connection.addEventListener(air.SQLErrorEvent.ERROR, this.onError);

		this.dbFile = air.File.applicationStorageDirectory.resolvePath("application.db");
		this.connection.openAsync(this.dbFile);
		this.create();
		
		console.log('-- Snippely.database.nuke() --');
	},
	
	create: function(){
		var sql = 
			"CREATE TABLE IF NOT EXISTS tags (" +
			"  id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			"  name TEXT" +
			")";
		
		this.execute(sql);
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
		air.trace("the database was created successfully");
	},
	
	onError: function(event){
		air.trace("Error message:", event.error.message);
		air.trace("Details:", event.error.details);
	},
	
	// Nuke the database
	
	nuke: function(){
		var sql = 'DROP TABLE tags';
		this.execute(sql);
	}
	
});
