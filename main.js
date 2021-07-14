const { BrowserWindow, app } = require('electron');

const createMainWindows = () => {
    const mainWindows = new BrowserWindow({
        title: 'ImageShrink',
        width: 500,
        height: 600,
    });
}

app.on('ready', createMainWindows);