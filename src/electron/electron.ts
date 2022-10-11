import { app, BrowserWindow, screen } from "electron";
import isDev from "electron-is-dev";
import * as path from "path";

function createWindow() {
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    console.log({ screenSize })


    const mainWindow = new BrowserWindow({
        height: Math.round(screenSize.height * 0.9),
        width: Math.round(screenSize.width * 0.9),
        show: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
        }
    });

    mainWindow.loadURL(
        isDev ? "http://localhost:8000" : `file://${path.join(__dirname, "../../public/index.html")}`
    )

    console.log(isDev ? "http://localhost:8000" : `file://${path.join(__dirname, "../../public/index.html")}`)
}

app.whenReady().then(() => {
    createWindow();


    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
