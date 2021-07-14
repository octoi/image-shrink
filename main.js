const { BrowserWindow, app } = require('electron');

let mainWindow;

const createMainWindows = () => {
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: 500,
        height: 600,
    });

    mainWindow.loadFile('./app/index.html');
}

app.on('ready', createMainWindows);