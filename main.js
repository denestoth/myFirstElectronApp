const electron = require('electron');
const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const ipcMain = require('electron').ipcMain;
const url = require('url');
const path = require('path');

const {Menu} = electron;

let mainWindow;
let addWindow;

app.on('ready', function() {
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));

	mainWindow.on('closed', function () {
		app.quit();
	})

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add window'
	});

	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addWindow.html'),
		protocol: 'file:',
		slashes: true
	}));

	addWindow.on('closed', function() {
		addWindow = null;
	})
}

ipcMain.on('item:add', function(e, item) {
	console.log(item);
	mainWindow.webContents.send('item:add', item);
	addWindow.close();
});

const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Add item',
				click() {
					createAddWindow();
				}
			},
			{
				label: 'Clear',
				click() {
					mainWindow.webContents.send('item:clear');
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click() {
					app.quit();
				}
			}
		]
	}
];

if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer tools',
		submenu: [
			{
				label: 'Toggle dev tools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	}

	);
}