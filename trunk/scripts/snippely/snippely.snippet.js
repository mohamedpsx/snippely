Snippely.Snippet = {
	
	initialize: function(){
		this.title = $('snippet-title');
		this.toolbar = $('meta');
		this.container = $('snippet-container');
		this.description = $('snippet-description');
		
		new Editable(this.title, { onBlur: this.updateTitle.bind(this) });
		new Editable(this.description, { enter: true, onBlur: this.updateDescription.bind(this) });
	},
	
	hide: function(){
		this.toolbar.setStyle('display', 'none');
		this.container.setStyle('display', 'none');
		Snippely.redraw();
	},
	
	show: function(){
		this.toolbar.setStyle('display', '');
		this.container.setStyle('display', '');
		Snippely.redraw();
	},
	
	load: function(id){
		var callback = function(result){
			var data = result.data && result.data[0];
			if (!data) return;
			var snippet = {
				id: data.id,
				title: data.title.unescape(),
				description: data.description.unescape()
			};
			this.build(snippet);
		}.bind(this);
		
		Snippely.database.execute(this.Queries.select, callback, {
			id: id
		});
	},
	
	build: function(snippet){
		this[snippet ? 'show' : 'hide']();
		if (!snippet) return;
		
		this.id = snippet.id;
		this.title.set('text', snippet.title);
		this.description.set('text', snippet.description);
	},
	
	updateTitle: function(element){
		Snippely.database.execute(this.Queries.updateTitle, Snippely.Snippets.refresh.bind(Snippely.Snippets), {
			id: this.id,
			title: element.get('text').escape()
		});
	},
	
	updateDescription: function(element){
		Snippely.database.execute(this.Queries.updateDescription, {
			id: this.id,
			description: element.get('text').escape()
		});
	}
	
};

//Snippet related queries

Snippely.Snippet.Queries = {
	
	select: "SELECT * FROM snippets WHERE id = :id",
	
	updateTitle: "UPDATE snippets SET title = :title WHERE id = :id",
	
	updateDescription: "UPDATE snippets SET description = :description WHERE id = :id"
	
};