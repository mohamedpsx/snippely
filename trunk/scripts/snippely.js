// Aliases

var console = AIR.Introspector.Console;

// Configuration

Application.autoExit = true;

// Snippely Object

var Snippely = {
	
	initialize: function(){
		nativeWindow.addEventListener('activate', this.focus);
		nativeWindow.addEventListener('deactivate', this.blur);
		
		// $$('#sidebar, #snippets, #content').addEvent('mousedown', function(event){ //disables selection on the whole panel
		// 	event.preventDefault();
		// });
		
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
		new Draggable([
			{ subject: 'content', property: 'left' },
			{ subject: 'sidebar', property: 'width' },
			{ subject: 'snippets', property: 'left' }
		], {
			min: 150,
			max: 300,
			axis: 'x',
			handle: 'sidebar-resizer'
		});
		
		new Draggable([
			{ subject: 'content', property: 'top' },
			{ subject: 'snippets', property: 'height' }
		], {
			min: 150,
			max: 300,
			axis: 'y',
			handle: 'snippets-resizer'
		});
		
		//selectable items
		var tags = $$('#tags li');
		tags.addEvent('click', function(){
			tags.removeClass('selected');
			this.addClass('selected');
		});
		var items = $$('#snippets-list li');
		items.addEvent('click', function(){
			items.removeClass('selected');
			this.addClass('selected');
		});
		
		//zebra striping
		$$('#snippets-list li:odd').addClass('odd');
		
		//meta buttons
		var metaButtons = $$('#meta .button');
		metaButtons.addEvent('mousedown', function(){
			this.addClass('active');
		});
		document.addEvent('mouseup', function(){
			metaButtons.removeClass('active');
		});
		
		new ART.ScrollBar('content', 'content-wrap', {
			autoHide: false
		});
		
		new ART.ScrollBar('sidebar', 'sidebar-wrap', {
			autoHide: false
		});
		
		new ART.ScrollBar('snippets', 'snippets-wrap', {
			autoHide: false
		});

		this.activate(); //activates the window, and sets it visible.
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
		nativeWindow.activate();
		nativeWindow.visible = true;
	}
	
};

Snippely.createMenus();
window.addEvent('load', Snippely.initialize.bind(Snippely));