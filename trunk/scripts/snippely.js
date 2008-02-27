// Aliases

var console = AIR.Introspector.Console;

// Configuration

Application.autoExit = true;

// Snippely Object

var Snippely = {
	
	createScrollBars: function(){
		this.contentScrollbar = new ART.ScrollBar('content', 'content-wrap');
		this.tagsScrollbar = new ART.ScrollBar('tags', 'tags-wrap');
		this.snippetsScrollbar = new ART.ScrollBar('snippets', 'snippets-wrap');
	},
	
	redraw: function(){
		
		this.contentScrollbar.update();
		this.snippetsScrollbar.update();
		this.tagsScrollbar.update();
		
		this.content.setStyle('left', this.tags.offsetWidth);
		this.snippets.setStyle('left', this.tags.offsetWidth);
		this.footer.setStyle('width', this.tags.clientWidth);
		this.topResizer.setStyle('left', this.tags.offsetWidth);
		
		this.topResizer.setStyle('top', this.snippets.offsetHeight);
		this.content.setStyle('top', this.topResizer.offsetHeight + this.snippets.offsetHeight);
	},
	
	initialize: function(){
		nativeWindow.addEventListener('activate', this.focus);
		nativeWindow.addEventListener('deactivate', this.blur);
		
		$('button-add').addEvent('mousedown', function(event){
			event.preventDefault(); //if we dont block the event, the mouse will be recognized as down by air, therefore selecting text.
			this.addClass('active');
			Snippely.addMenu.display(event.client); //he doesnt care about my passed positions.. whoa.
			this.removeClass('active'); //apparently, the menu blocks all activity.
		});
		
		$('button-action').addEvent('mousedown', function(event){
			event.preventDefault();
			this.addClass('active');
			Snippely.actionMenu.display(event.client);
			this.removeClass('active');
		});
		
		//drag instances
		
		this.content = $('content');
		this.snippets = $('snippets');
		this.tags = $('tags');
		this.footer = $('footer');
		
		this.topResizer = $('top-resizer');
		this.leftResizer = $('left-resizer');
		
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
		// var metaButtons = $$('#meta .button');
		// 
		// metaButtons.addEvent('mousedown', function(){
		// 	this.addClass('active');
		// });
		// 
		// document.addEvent('mouseup', function(){
		// 	metaButtons.removeClass('active');
		// });
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
	
	focus: function(){
		document.body.id = 'focus';
	},
	
	blur: function(){
		document.body.id = 'blur';
	},
	
	activate: function(){
		(function(){
			Snippely.redraw();
			nativeWindow.visible = true;
			nativeWindow.activate();
		}).delay(100); //give some time to render, or else garbage will be displayed
		
	}
	
};

Snippely.createMenus();

window.addEvent('load', function(){
	Snippely.initialize();
	Snippely.activate();
});