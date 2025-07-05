const path = require('path');
const projectName = 'widget-3d-car-unity';

const buildDir = path.join(process.resourcesPath, 'Build');

window.unityConfig = {
  buildUrl: buildDir,
  loaderUrl: path.join(buildDir, `${projectName}.loader.js`)
};
