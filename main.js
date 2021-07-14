const { app, BrowserWindow, Menu } = require('electron');

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV == 'development';
const isMac = process.platform == 'darwin';

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


const menu = [
    ...(!isDev ? [] : [
        {
            label: 'Developer',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { type: 'separator' },
                { role: 'toggledevtools' },
            ],
        },
    ])
]

app.on('ready', () => {
    createMainWindow();

    if (isDev) {
        const mainMenu = Menu.buildFromTemplate(menu);
        Menu.setApplicationMenu(mainMenu);
    } else {
        mainWindow.removeMenu();
    }

    mainWindow.on('ready', () => mainWindow = null);
});


app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length == 0) {
        createMainWindow();
    }
});