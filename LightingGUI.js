import * as dat from 'dat.gui';

export class LightingGUI {
  constructor(scene, lighting) {
    this.scene = scene;
    this.lighting = lighting;

    this.gui = new dat.GUI();
    this.createLightingFolders();
  }

  createLightingFolders() {
    this.lightingFolders = this.lighting.lights.map((light, index) => {
      const folder = this.gui.addFolder(`Light ${index + 1}`);

      const controllers = {
        posX: folder.add(light.position, 0, -200, 200).name('Position X').onChange(() => this.updateLighting(index)),
        posY: folder.add(light.position, 1, -200, 200).name('Position Y').onChange(() => this.updateLighting(index)),
        posZ: folder.add(light.position, 2, -200, 200).name('Position Z').onChange(() => this.updateLighting(index)),
        colorR: folder.add(light.color, 0, 0, 1).name('Color R').onChange(() => this.updateLighting(index)),
        colorG: folder.add(light.color, 1, 0, 1).name('Color G').onChange(() => this.updateLighting(index)),
        colorB: folder.add(light.color, 2, 0, 1).name('Color B').onChange(() => this.updateLighting(index)),
        intensity: folder.add(light, 'intensity', 0, 5).name('Intensity').onChange(() => this.updateLighting(index)),
        ambientIntensity: folder.add(light, 'ambientIntensity', 0, 1).name('Ambient Intensity').onChange(() => this.updateLighting(index))
      };

      folder.controllers = controllers;
      folder.open();

      return folder;
    });
  }

  updateLighting(lightIndex) {
    const light = this.lighting.lights[lightIndex];
    const controllers = this.lightingFolders[lightIndex].controllers;

    light.position[0] = controllers.posX.getValue();
    light.position[1] = controllers.posY.getValue();
    light.position[2] = controllers.posZ.getValue();

    light.color[0] = controllers.colorR.getValue();
    light.color[1] = controllers.colorG.getValue();
    light.color[2] = controllers.colorB.getValue();
    
    light.intensity = controllers.intensity.getValue();
    light.ambientIntensity = controllers.ambientIntensity.getValue();
  }
}