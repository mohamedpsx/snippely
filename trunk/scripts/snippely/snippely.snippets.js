Snippely.Snippets = {

	load: function(snippets){
		var list = $('snippets-list').empty();
		var elements = snippets.map(function(snippet){
			var element = new Element('li', { text: snippet.title });
			element.addEvent('click', this.select.bind(this, element));
			element.store('snippet:id', snippet.id);
			return element;
		}, this);
		
		list.adopt(elements).getElements(':odd').addClass('odd');
		this.elements = $$(elements);
	},
	
	select: function(element){
		this.elements.removeClass('selected');
		element.addClass('selected');
		
		var id = element.retrieve('snippet:id');
		var snippet = SNIPPET[id]; //TODO - retrieve snippet from database
		Snippely.Snippet.load(snippet);
	}
	
};
