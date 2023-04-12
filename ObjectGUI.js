import { mat4, quat, vec3 } from 'gl-matrix';
import * as dat from 'dat.gui';
import { extractTranslationRotationScale } from './utils/extractTranslationRotationScale.js';
import { createModelMatrix } from './utils/createModelMatrix.js';

export class ObjectGUI {
    constructor(scene, objects, textures) {
      this.scene = scene;
      this.objects = objects;
      this.textures = textures;

      this.selectedObjectIndex = 0;
  
      // Create simple objects to store position, rotation, and scale
      this.position = { x: 0, y: 0, z: 0 };
      this.rotation = { x: 0, y: 0, z: 0 };
      this.scale = { x: 1, y: 1, z: 1 };
  
      this.gui = new dat.GUI();
      this.createGUI();
    }

    createGUI() {
      this.gui = new dat.GUI();
      this.objectSelector = this.gui.add(this, 'selectedObjectIndex', 0, this.objects.length - 1).name('Object').step(1).onChange(() => this.updateSelectedObject());
      this.objectSelector.domElement.style.pointerEvents = "all";
      this.setupPositionFolder();
      this.setupRotationFolder();
      this.setupScaleFolder();
      this.setupTexturesFolder();
      this.updateSelectedObject();
    }
    
    setupTexturesFolder() {
      this.texturesFolder = this.gui.addFolder('Textures');
      
      const textureNames = Object.keys(this.textures);
      const textureTypes = ['Diffuse', 'Normal', 'Specular'];
    
      this.selectedTextures = {
        diffuse: textureNames.length > 0 ? textureNames[0] : '',
        normal: textureNames.length > 0 ? textureNames[0] : '',
        specular: textureNames.length > 0 ? textureNames[0] : ''
      };
    
      textureTypes.forEach((type) => {
        this.texturesFolder.add(this.selectedTextures, type.toLowerCase(), textureNames)
          .name(`${type} Texture`)
          .onChange(() => {
            this.scene.requestRender();
          });
      });
    
      this.texturesFolder.open();
    }

    setupPositionFolder() {
        this.positionFolder = this.gui.addFolder('Position');
        this.positionControllers = {
          x: this.positionFolder.add(this.position, 'x', -10, 10).name('X').onChange(() => this.updateModelMatrix()),
          y: this.positionFolder.add(this.position, 'y', -10, 10).name('Y').onChange(() => this.updateModelMatrix()),
          z: this.positionFolder.add(this.position, 'z', -10, 10).name('Z').onChange(() => this.updateModelMatrix())
        };
        this.positionFolder.open();
      }
      
      setupRotationFolder() {
        this.rotationFolder = this.gui.addFolder('Rotation');
        this.rotationControllers = {
          x: this.rotationFolder.add(this.rotation, 'x', 0, 360).name('Rotate X').onChange(() => this.updateModelMatrix()),
          y: this.rotationFolder.add(this.rotation, 'y', 0, 360).name('Rotate Y').onChange(() => this.updateModelMatrix()),
          z: this.rotationFolder.add(this.rotation, 'z', 0, 360).name('Rotate Z').onChange(() => this.updateModelMatrix())
        };
        this.rotationFolder.open();
      }
      
      setupScaleFolder() {
        this.scaleFolder = this.gui.addFolder('Scale');
        this.scaleControllers = {
          x: this.scaleFolder.add(this.scale, 'x', 0.1, 10).name('Scale X').onChange(() => this.updateModelMatrix()),
          y: this.scaleFolder.add(this.scale, 'y', 0.1, 10).name('Scale Y').onChange(() => this.updateModelMatrix()),
          z: this.scaleFolder.add(this.scale, 'z', 0.1, 10).name('Scale Z').onChange(() => this.updateModelMatrix())
        };
        this.scaleFolder.open();
      }

      updateSelectedObject() {
        const objectTransform = extractTranslationRotationScale(this.objects[this.selectedObjectIndex].modelMatrix);
        this.position.x = objectTransform.position.x;
        this.position.y = objectTransform.position.y;
        this.position.z = objectTransform.position.z;
        this.rotation.x = objectTransform.rotation.x;
        this.rotation.y = objectTransform.rotation.y;
        this.rotation.z = objectTransform.rotation.z;
        this.scale.x = objectTransform.scale.x;
        this.scale.y = objectTransform.scale.y;
        this.scale.z = objectTransform.scale.z;
      
        // Update GUI controllers
        for (const axis in this.positionControllers) {
          this.positionControllers[axis].updateDisplay();
        }
        for (const axis in this.rotationControllers) {
          this.rotationControllers[axis].updateDisplay();
        }
        for (const axis in this.scaleControllers) {
          this.scaleControllers[axis].updateDisplay();
        }
      }

      updateModelMatrix() {
        const object = this.objects[this.selectedObjectIndex];
        const position = vec3.fromValues(this.position.x, this.position.y, this.position.z);
        const rotation = vec3.fromValues(this.rotation.x, this.rotation.y, this.rotation.z);
        const scale = vec3.fromValues(this.scale.x, this.scale.y, this.scale.z);
      
        object.modelMatrix = createModelMatrix(position, rotation, scale);
        this.scene.requestRender();
      }
}