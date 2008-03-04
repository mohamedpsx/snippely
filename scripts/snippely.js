// Aliases

var console = AIR.Introspector.Console;

// Configuration

Application.autoExit = true;

// Snippely Object

var Snippely = {
	
	initialize: function(){
		this.meta = $('meta');
		this.tags = $('tags');
		this.footer = $('footer');
		this.content = $('content');
		this.snippets = $('snippets');
		this.topResizer = $('top-resizer');
		this.leftResizer = $('left-resizer');
		
		this.initializeMenus();
		this.initializeLayout();
		this.initializeHistory();
		
		this.initializeTags();
		this.initializeMetas();
		this.initializeSnippets();
		
		this.initializeSnippet();
		
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
		this.contentScrollbar = new ART.ScrollBar('content', 'content-wrap');
		this.snippetsScrollbar = new ART.ScrollBar('snippets', 'snippets-wrap');
		
		this.redraw();
	},
	
	initializeHistory: function(){
		$$('#content div.contents').each(function(element){
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
	},
	
	initializeTags: function(){
		var tags = $$('#tags li');
		tags.addEvent('click', function(){
			tags.removeClass('selected');
			this.addClass('selected');
		});
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
	
	initializeSnippets: function(){
		var snippets = $$('#snippets li');
		snippets.addEvent('click', function(){
			snippets.removeClass('selected');
			this.addClass('selected');
		});
		
		$$('#snippets li:odd').addClass('odd');
	},
	
	initializeSnippet: function(){
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
		
		$$('#content div.snippet').addEvent('mousedown', focus);
		document.addEvent('mousedown', function(){
			blur.call(active);
		});
	},
	
	redraw: function(){
		var left = this.tags.offsetWidth;
		$$(this.snippets, this.topResizer, this.meta, this.content).setStyle('left', left);
		
		this.footer.setStyle('width', this.tags.clientWidth);
		this.topResizer.setStyle('top', this.snippets.offsetHeight);
		this.meta.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight);
		this.content.setStyle('top', this.snippets.offsetHeight + this.topResizer.offsetHeight + this.meta.offsetHeight);
		
		this.tagsScrollbar.update();
		this.contentScrollbar.update();
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

window.addEvent('load', Snippely.initialize.bind(Snippely));