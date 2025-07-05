const { ipcMain, app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
}

function startGrpcServer() {
  const options = {
    includeDirs: [path.join(process.resourcesPath, 'proto')]
  };
  
  const protoPath = path.join(process.resourcesPath, 'proto/kuksa/val/v1/val.proto');
  const packageDef = protoLoader.loadSync(protoPath, options);
  const grpcObject = grpc.loadPackageDefinition(packageDef);
  const valService = grpcObject.kuksa.val.v1;

  const server = new grpc.Server();
  server.addService(valService.VAL.service, {
    Get: (call, callback) => {
      console.log("Received Get request:", call.request);
      // send to renderer
      mainWindow.webContents.send('send-to-unity', call.request);
      callback(null, { entries: [], errors: [], error: null });
    },
    Set: (call, callback) => {
      console.log("Received Set request:", call.request);
      // send to renderer
      mainWindow.webContents.send('send-to-unity', call.request);
      callback(null, { error: null, errors: [] });
    },
    GetServerInfo: (call, callback) => {
      console.log("Received GetServerInfo request");
      callback(null, { name: "Unity-Electron-App", version: "1.0.0" });
    }
  });

  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log("gRPC server started on port 50051");
  });
}

app.whenReady().then(() => {
  createWindow();
  startGrpcServer();
});
