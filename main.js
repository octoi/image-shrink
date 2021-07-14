const path = require('path');
const os = require('os');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const slash = require('slash');

process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV == 'development';
const isMac = process.platform == 'darwin';

let mainWindow;

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: isDev ? 1000 : 500,
        height: 600,
        icon: './app/assets/icons/Icon_256x256.png',
        resizable: isDev, // enable resize option on development mode
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile('./app/index.html');
}

const shrinkImage = async ({ imgPath, quality, dest }) => {
    try {
        const pngQuality = quality / 100;

        const files = await imagemin([slash(imgPath)], {
            destination: dest,
            plugins: [
                imageminMozjpeg({ quality }),
                imageminPngquant({ quality: [pngQuality, pngQuality] }),
            ]
        });

        shell.openPath(dest);

        mainWindow.webContents.send('image:done');
    } catch (err) {
        mainWindow.webContents.send('image:failed');
    }
}

ipcMain.on('image:minimize', (e, options) => {
    options.dest = path.join(os.homedir(), 'imageshrink');
    shrinkImage(options);
});

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