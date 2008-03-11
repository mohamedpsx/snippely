// Aliases

var console = AIR.Introspector.Console;

// Configuration

Application.autoExit = true;

// Temporary Data

var TAGS = [
	{ id: 1, name: 'Some Tag 1' },
	{ id: 2, name: 'Some Tag 2' },
	{ id: 3, name: 'Some Tag 3' }
];

var SNIPPETS = {
	"1": [
		{ id: 1, name: 'Some Snippet 1' },
		{ id: 2, name: 'Some Snippet 2' },
		{ id: 3, name: 'Some Snippet 3' }
	],
	"2": [
		{ id: 4, name: 'Some Snippet 4' },
		{ id: 5, name: 'Some Snippet 5' },
		{ id: 6, name: 'Some Snippet 6' },
		{ id: 7, name: 'Some Snippet 7' }
	],
	"3": [
		{ id: 1, name: 'Some Snippet 1' },
		{ id: 3, name: 'Some Snippet 3' },
		{ id: 5, name: 'Some Snippet 5' }
	]
};

// Snippely Object

var Snippely = {
	
	initialize: function(){
		this.meta = $('meta');
		this.tags = $('tags');
		this.footer = $('footer');
		this.snippet = $('snippet');
		this.snippets = $('snippets');
		this.topResizer = $('top-resizer');
		this.leftResizer = $('left-resizer');
		
		this.initializeMenus();
		this.initializeLayout();
		this.initializeMetas();
		
		//TEMP - TAGS should be retrieved from the database
		this.Tags.load(TAGS);
		
		//TEMP - this should be called upon clicking a snippet in the snippets list
		this.Snippet.load();
		
		this.activate();
	},
	
	initializeMenus: function(){
		//main menus
		this.mainMenu = new ART.Menu('MainMenu');
		this.saveItem = new ART.Menu.Item('Save');
		this.loadItem = new ART.Menu.Item('Load');
		this.saveItem.shortcut = 'command+s';
		this.loadItem.shortcut = 'command+l';
		this.fileMenu = new ART.Menu('File').addItem(this.saveItem).addItem(this.loadItem);
		this.mainMenu.addMenu(this.fileMenu);
		
		//add menu
		this.addMenu = new ART.Menu('AddMenu');
		this.addTagItem = new ART.Menu.Item('Add Tag...');
		this.addSnippetItem = new ART.Menu.Item('Add Snippet...');
		this.addMenu.addItem(this.addTagItem).addItem(this.addSnippetItem);
		
		//action menu
		this.actionMenu = new ART.Menu('ActionMenu');
		this.removeTagItem = new ART.Menu.Item('Remove Tag...');
		this.renameTagItem = new ART.Menu.Item('Rename Tag...');
		this.removeSnippetItem = new ART.Menu.Item('Remove Snippet...');
		this.renameSnippetItem = new ART.Menu.Item('Rename Snippet...');
		this.actionMenu.addItem(this.renameTagItem).addItem(this.removeTagItem).addItem(this.renameSnippetItem).addItem(this.removeSnippetItem);
		
		$('button-add').addEvent('mousedown', function(event){
			this.addClass('active');
			Snippely.addMenu.display(event.client); //he doesnt care about my passed positions.. whoa.
			this.removeClass('active'); //apparently, the menu blocks all activity.
		});
		
		$('button-action').addEvent('mousedown', function(event){
			this.addClass('active');
			Snippely.actionMenu.display(event.client);
			this.removeClass('active');
		});
	},
	
	initializeLayout: function(){
		var redraw = this.redraw.bind(this);
		
		new Drag(this.tags, {
			modifiers: {y: null, x: 'width'},
			handle: this.leftResizer,
			limit: {x: [150, 300]},
			onDrag: redraw
		});

		new Drag(this.snippets, {
			modifiers: {y: 'height', x: null},
			handle: this.topResizer,
			limit: {y: [38, function(){
				return $('snippets-wrap').scrollHeight;
			}]},
			onDrag: redraw
		});
		
		nativeWindow.addEventListener('resize', redraw);
		nativeWindow.addEventListener('activate', redraw);
		nativeWindow.addEventListener('deactivate', redraw);
		nativeWindow.addEventListener('activate', this.focus);
		nativeWindow.addEventListener('deactivate', this.blur);

		this.tagsScrollbar = new ART.ScrollBar('tags', 'tags-wrap');
		this.snippetScrollbar = new ART.ScrollBar('snippet', 'snippet-wrap');
		this.snippetsScrollbar = new ART.ScrollBar('snippets', 'snippets-wrap');
		
		this.redraw();
	},
	
	initializeMetas: function(){
		var metaButtons = $$('#meta .button');
		metaButtons.addEvent('mousedown', function(){
			this.addClass('active');
		});
		document.addEvent('mouseup', function(){
			metaButtons.removeClass('active');
		});
	},
	
	redraw: function(){
		var left = this.tags.offsetWidth;
		$$(this.snippets, this.topResizer, this.meta, this.snippet).setStyle('left', left);
		
		this.footer.setStyle('width', this.tags.clientWidth);
		this.topResizer.setStyle('top', this.snippets.offsetHeight);
		this.meta.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight);
		this.snippet.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight + this.meta.offsetHeight);
		
		this.tagsScrollbar.update();
		this.snippetScrollbar.update();
		this.snippetsScrollbar.update();
	},
	
	activate: function(){
		(function(){
			nativeWindow.visible = true;
			nativeWindow.activate();
		}).delay(100); //give some time to render, or else garbage will be displayed
	},

	focus: function(){
		document.body.id = 'focus';
	},
	
	blur: function(){
		document.body.id = 'blur';
	} 
	
};

//The Tags List

Snippely.Tags = {

	load: function(tags){
		var list = $('tags-list').empty();
		var elements = tags.map(function(tag){
			var element = new Element('li', { text: tag.name });
			element.addEvent('click', this.select.bind(this, element));
			element.store('tag:id', tag.id);
			return element;
		}, this);
		
		list.adopt(elements);
		this.elements = $$(elements);
	},
	
	select: function(element){
		this.elements.removeClass('selected');
		element.addClass('selected');

		var id = element.retrieve('tag:id');
		var snippets = SNIPPETS[id]; //TEMP
		
		//retrieve this tag's snippets from the database and load them
		
		Snippely.Snippets.load(snippets);
	}

};

//The Snippets List

Snippely.Snippets = {

	load: function(snippets){
		var list = $('snippets-list').empty();
		var elements = snippets.map(function(snippet){
			var element = new Element('li', { text: snippet.name });
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
		
		//retrieve this snippet from the database and load its content
	}
	
};

//The Snippet and all his Snips

Snippely.Snippet = {

	load: function(){
		var active = false;
		
		var blur = function(){
			if (!this.editing) return;
			this.editing = active = false;
			this.removeClass('editing').getElement('.contents').contentEditable = false;
		};
		
		var focus = function(event){
			event.stopPropagation();
			if (this.editing) return;
			if (active) blur.call(active);
			this.addClass('editing').getElement('.contents').contentEditable = true;
			this.editing = true;
			active = this;
		};
		
		$$('#snippet-snips div.snippet').addEvent('mousedown', focus);
		document.addEvent('mousedown', function(){
			blur.call(active);
		});
		
		//Initialize History
		$$('#snippet-snips div.contents').each(function(element){
			element.setHTML(element.getHTML().trim());
			element.history = [element.getHTML()];
			element.addEvent('keydown', function(event){
				if (event.meta && event.key == 'z'){
					event.preventDefault();
					var start = this.selectionStart;
					var previous = (this.history.length > 1) ? this.history.pop() : this.history[0];
					this.setHTML(previous);
				} else {
					if (this.getHTML() != this.history.getLast()) this.history.push(this.getHTML());
				}
			});
		});
		
		new Sortables('snippet-snips', { handle: 'div.info' });
	}

};

window.addEvent('load', Snippely.initialize.bind(Snippely));