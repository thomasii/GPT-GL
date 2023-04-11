import * as dat from 'dat.gui';

export class LightingGUI {
  constructor(scene, lighting) {
    this.scene = scene;
    this.lighting = lighting;

    this.gui = new dat.GUI();
    this.createLightingFolder();
  }

  createLightingFolder() {
    this.lightingFolder = this.gui.addFolder('Lighting');

    this.lightingControllers = {
      colorR: this.lightingFolder.add(this.lighting.color, 0, 0, 1).name('Color R').onChange(() => this.updateLighting()),
      colorG: this.lightingFolder.add(this.lighting.color, 1, 0, 1).name('Color G').onChange(() => this.updateLighting()),
      colorB: this.lightingFolder.add(this.lighting.color, 2, 0, 1).name('Color B').onChange(() => this.updateLighting()),
      intensity: this.lightingFolder.add(this.lighting, 'intensity', 0, 5).name('Intensity').onChange(() => this.updateLighting()),
      ambientIntensity: this.lightingFolder.add(this.lighting, 'ambientIntensity', 0, 1).name('Ambient Intensity').onChange(() => this.updateLighting())
    };

    this.lightingFolder.open();
  }

  updateLighting() {
    this.lighting.setColor([this.lightingControllers.colorR.getValue(), this.lightingControllers.colorG.getValue(), this.lightingControllers.colorB.getValue()]);
    this.lighting.setIntensity(this.lightingControllers.intensity.getValue());
    this.lighting.setAmbientIntensity(this.lightingControllers.ambientIntensity.getValue());
  }
}