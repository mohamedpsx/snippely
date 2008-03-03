// Aliases

var console = AIR.Introspector.Console;

// Configuration

Application.autoExit = true;

// Snippely Object

var Snippely = {
	
	initialize: function(){
		
		var makeEditable = function(){
			if (this.editing) return;
			this.addClass('editing');
			this.getElement('.contents').contentEditable = true;
			this.editing = true;
		};
		
		var makeUnEditable = function(){
			if (!this.editing) return;
			this.removeClass('editing');
			this.getElement('.contents').contentEditable = false;
			this.editing = false;
		};
		
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
		
		// $$('#content div.snippet').each(function(element){
		// 	element.addEvent('mousedown', makeEditable);
		// 	element.addEvent('mouseleave', makeUnEditable);
		// });
		
		//elements
		
		this.content = $('content');
		this.snippets = $('snippets');
		this.tags = $('tags');
		this.footer = $('footer');
		
		this.meta = $('meta');
		
		this.topResizer = $('top-resizer');
		this.leftResizer = $('left-resizer');
		
		
		nativeWindow.addEventListener('activate', this.focus);
		nativeWindow.addEventListener('deactivate', this.blur);
		
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
		
		//drag instances
		
		this.createScrollBars();
		
		new Drag(this.tags, {
			modifiers: {y: null, x: 'width'},
			handle: this.leftResizer,
			limit: {x: [150, 300]},
			onDrag: this.redraw.bind(this)
		});

		new Drag('snippets', {
			modifiers: {y: 'height', x: null},
			handle: this.topResizer,
			limit: {y: [38, function(){
				return $('snippets-wrap').scrollHeight;
			}]},
			onDrag: this.redraw.bind(this)
		});
		
		//redraw on resize
		nativeWindow.addEventListener('resize', this.redraw.bind(this));
		nativeWindow.addEventListener('activate', this.redraw.bind(this));
		nativeWindow.addEventListener('deactivate', this.redraw.bind(this));
		
		// this.redraw();
		this.redraw();
		
		//selectable items
		var tagElements = $$('#tags li');
		tagElements.addEvent('click', function(){
			tagElements.removeClass('selected');
			this.addClass('selected');
		});
		var snippetElements = $$('#snippets li');
		snippetElements.addEvent('click', function(){
			snippetElements.removeClass('selected');
			this.addClass('selected');
		});
		
		//zebra striping
		$$('#snippets li:odd').addClass('odd');
		
		//meta buttons
		var metaButtons = $$('#meta .button');
		
		metaButtons.addEvent('mousedown', function(){
			this.addClass('active');
		});
		
		document.addEvent('mouseup', function(){
			metaButtons.removeClass('active');
		});
	},
	
	createScrollBars: function(){
		this.tagsScrollbar = new ART.ScrollBar('tags', 'tags-wrap');
		this.contentScrollbar = new ART.ScrollBar('content', 'content-wrap');
		this.snippetsScrollbar = new ART.ScrollBar('snippets', 'snippets-wrap');
	},
	
	createMenus: function(){
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

Snippely.createMenus();

window.addEvent('load', function(){
	Snippely.initialize();
	Snippely.activate();
});