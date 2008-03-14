Snippely.Snippet = {
	
	initialize: function(){
		this.title = $('snippet-title');
		this.container = $('snippet-container');
		this.description = $('snippet-description');
		
		new Editable(this.title, { onBlur: this.saveTitle.bind(this) });
		new Editable(this.description, { enter: true, onBlur: this.saveDescription.bind(this) });
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
	
	saveTitle: function(element){
		var id = this.id;
		var title = element.get('text');
		
		var callback = function(){
			var snippet = $('snippet_' + id);
			if (snippet) snippet.set('text', title);
		};
		
		Snippely.database.execute(this.Queries.updateTitle, callback, {
			id: id,
			title: title.escape()
		});
	},
	
	saveDescription: function(element){
		Snippely.database.execute(this.Queries.updateDescription, {
			id: this.id,
			description: element.get('text').escape()
		});
	},
	
	hide: function(){
		this.container.setStyle('display', 'none');
	},
	
	show: function(){
		this.container.setStyle('display', '');
	}

};

//Snippet related queries

Snippely.Snippet.Queries = {
	
	select: "SELECT * FROM snippets WHERE id = :id",
	
	updateTitle: "UPDATE snippets SET title = :title WHERE id = :id",
	
	updateDescription: "UPDATE snippets SET description = :description WHERE id = :id"
	
};

//history for later
/*
content.history = [content.get('html')];
content.addEvent('keydown', function(event){
	if (event.meta && event.key == 'z'){
		event.preventDefault();
		var start = this.selectionStart;
		var previous = (this.history.length > 1) ? this.history.pop() : this.history[0];
		this.set('html', previous);
	} else {
		if (this.get('html') != this.history.getLast()) this.history.push(this.get('html'));
	}
});
*/