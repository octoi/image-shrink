const { BrowserWindow, app } = require('electron');

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV == 'development';

let mainWindow;

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: 500,
        height: 600,
        icon: './app/assets/icons/Icon_256x256.png',
        resizable: isDev, // enable resize option on development mode
    });

    mainWindow.loadFile('./app/index.html');
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length == 0) {
        createMainWindow();
    }
});