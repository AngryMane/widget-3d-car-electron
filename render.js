const { ipcRenderer } = require('electron');


ipcRenderer.on('send-to-unity', (event, cmd) => {
  console.log("Sending command to Unity:", cmd);
  if (window.unityInstance && typeof window.unityInstance.SendMessage === 'function') {
    window.unityInstance.SendMessage('GameObjectName', 'MethodName', cmd);
  }
});
