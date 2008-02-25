// Aliases

var console = AIR.Introspector.Console;

// Configuration

Application.autoExit = false;

// Snippely Object

var Snippely = {
	
	createMenus: function(){ //create the menus
		
		this.mainMenu = new ART.Menu('MainMenu');

		this.saveItem = new ART.Menu.Item('Save');
		this.loadItem = new ART.Menu.Item('Load');

		// this.saveItem.addEvent('onSelect', function(){
		// 	console.log('saving...');
		// });

		this.saveItem.shortcut = 'command+s';
		this.loadItem.shortcut = 'command+l';

		// this.loadItem.addEvent('onSelect', function(){
		// 	console.log('loading...');
		// });

		this.fileMenu = new ART.Menu('File').addItem(
			this.saveItem
		).addItem(
			this.loadItem
		);

		this.mainMenu.addMenu(this.fileMenu);
		
		//add menu
		
		this.addMenu = new ART.Menu('AddMenu');
		
		this.addTagItem = new ART.Menu.Item('Add Tag...');
		this.addSnippetItem = new ART.Menu.Item('Add Snippet...');
		
		this.addMenu.addItem(
			this.addTagItem
		).addItem(
			this.addSnippetItem
		);
		
		//action menu
		
		this.actionMenu = new ART.Menu('ActionMenu');
		
		this.removeTagItem = new ART.Menu.Item('Remove Tag...');
		this.renameTagItem = new ART.Menu.Item('Rename Tag...');
		
		this.removeSnippetItem = new ART.Menu.Item('Remove Snippet...');
		this.renameSnippetItem = new ART.Menu.Item('Rename Snippet...');
		
		this.actionMenu.addItem(
			this.renameTagItem
		).addItem(
			this.removeTagItem
		).addItem(
			this.renameSnippetItem
		).addItem(
			this.removeSnippetItem
		);
		
	},
	
	focus: function(){
		$(document.body).set('id', 'focus');
	},
	
	blur: function(){
		$(document.body).set('id', 'blur');
	},
	
	domReady: function(){
		
		nativeWindow.addEventListener('activate', this.focus);
		
		nativeWindow.addEventListener('deactivate', this.blur);
		
		$('panel-cell').addEvent('mousedown', function(event){ //disables selection on the whole panel
			event.preventDefault();
		});
		
		$('button-add').addEvent('mousedown', function(event){
			event.preventDefault(); //if we dont block the event, the mouse will be recognized as down by air, therefore selecting text.
			this.addClass('active');
			Snippely.addMenu.display({x: 0, y: 0}); //he doesnt care about my passed positions.. whoa.
			this.removeClass('active'); //apparently, the menu blocks all activity.
		});
		
		$('button-action').addEvent('mousedown', function(event){
			event.preventDefault();
			this.addClass('active');
			Snippely.actionMenu.display(event.client);
			this.removeClass('active');
		});
		
		//drag that panel
		
		new Drag($('panel'), {
			handle: $$('#splitter, #panel-resizer'),
			modifiers: {x: 'width', y: null},
			limit: {x: [100, 400]}
		});
		
		var tags = $$('.tag'); 
		
		tags.addEvent('mouseup', function(){
			tags.removeClass('selected');
			this.addClass('selected');
		});
	},
	
	activate: function(){
		nativeWindow.activate();
		nativeWindow.visible = true;
	}
	
};

Snippely.createMenus();

window.addEvent('load', function(){
	Snippely.domReady(); //performs actions on elements.
	Snippely.activate(); //activates the window, and sets it visible.
});