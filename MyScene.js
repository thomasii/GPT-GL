import { Scene } from './Scene.js';
import { Geometry } from './geometry.js';
import { Lighting } from './lighting.js';
import { mat4, quat } from 'gl-matrix';
import { Camera } from './camera.js';
import { createModelViewProjectionMatrix } from './transformations.js';
import { generateCube } from './cube.js';
import { generateWall } from './wall.js';
import * as dat from 'dat.gui';

export class MyScene extends Scene {
  constructor(canvas) {
    super(canvas);
    this.gl.disable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    // Create a new lighting object
    this.lighting = new Lighting([30, 70, 100], [1, 1, 1], 1);

    // Create objects and add them to the scene
    this.objects = [
      {
        geometry: new Geometry(this.gl, this.program, generateCube()),
        modelMatrix: mat4.create()
      },
      {
        geometry: new Geometry(this.gl, this.program, generateCube()),
        modelMatrix: mat4.fromRotationTranslationScale(mat4.create(), quat.create(), [0, 0, -4], [4, 4, 0.1])
      },
      {
        geometry: new Geometry(this.gl, this.program, generateCube()),
        modelMatrix: mat4.fromRotationTranslationScale(mat4.create(), quat.create(), [0, -2.5, 0], [4, 0.1, 4])
      },
    ];
    // Create camera and set initial position and rotation speeds
    this.camera = new Camera([0, 0, 10], 0.05, 0.1);

    // Set the selected object index
    this.selectedObjectIndex = 1;

  // Initialize properties for position and rotation based on the selected object's transformation
  const objectTransform = extractTranslationRotationScale(this.objects[this.selectedObjectIndex].modelMatrix);
  this.position = { ...objectTransform.position }; // Change this line
  this.rotation = { ...objectTransform.rotation }; // Change this line
  this.scale = { ...objectTransform.scale }; // Add this line

  this.createGUI();
}

  drawScene() {
    // Clear the canvas and depth buffer
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Set up the lighting uniforms
    this.lighting.setupUniforms(this.gl, this.program);

    // Draw objects in the scene
    for (const object of this.objects) {
      this.drawObject(object);
    }

    // Request the next frame to continuously update the camera position
    requestAnimationFrame(() => this.drawScene());
  }

  drawObject(object) {
    // Set up the model-view-projection matrix
    const modelViewProjectionMatrix = createModelViewProjectionMatrix(this.gl.canvas, this.camera, object.modelMatrix);
  
    // Set the uniform for the model-view-projection matrix
    const modelViewProjectionMatrixUniform = this.gl.getUniformLocation(this.program, "u_modelViewProjectionMatrix");
    this.gl.uniformMatrix4fv(modelViewProjectionMatrixUniform, false, modelViewProjectionMatrix);
  
    // Draw the object
    object.geometry.draw(this.gl);
  }

  createGUI() {
    this.gui = new dat.GUI();
  
    const objectSelector = this.gui.add(this, 'selectedObjectIndex', 0, this.objects.length - 1).name('Object').step(1).onChange(() => this.updateSelectedObject());
    objectSelector.domElement.style.pointerEvents = "all";
  
    this.positionFolder = this.gui.addFolder('Position');
    this.rotationFolder = this.gui.addFolder('Rotation');
    this.scaleFolder = this.gui.addFolder('Scale');
  
    this.positionControllers = {
      x: this.positionFolder.add(this.position, 'x', -10, 10).name('X').onChange(() => this.updateModelMatrix()),
      y: this.positionFolder.add(this.position, 'y', -10, 10).name('Y').onChange(() => this.updateModelMatrix()),
      z: this.positionFolder.add(this.position, 'z', -10, 10).name('Z').onChange(() => this.updateModelMatrix())
    };
  
    this.rotationControllers = {
      x: this.rotationFolder.add(this.rotation, 'x', 0, 360).name('Rotate X').onChange(() => this.updateModelMatrix()),
      y: this.rotationFolder.add(this.rotation, 'y', 0, 360).name('Rotate Y').onChange(() => this.updateModelMatrix()),
      z: this.rotationFolder.add(this.rotation, 'z', 0, 360).name('Rotate Z').onChange(() => this.updateModelMatrix())
    };
  
    this.scaleControllers = {
      x: this.scaleFolder.add(this.scale, 'x', 0.1, 10).name('Scale X').onChange(() => this.updateModelMatrix()),
      y: this.scaleFolder.add(this.scale, 'y', 0.1, 10).name('Scale Y').onChange(() => this.updateModelMatrix()),
      z: this.scaleFolder.add(this.scale, 'z', 0.1, 10).name('Scale Z').onChange(() => this.updateModelMatrix())
    };
  
    this.positionFolder.open();
    this.rotationFolder.open();
    this.scaleFolder.open();

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
  
    this.updateGUI();
  }
  
  
  updateGUI() {
    this.positionControllers.x.setValue(this.position.x);
    this.positionControllers.y.setValue(this.position.y);
    this.positionControllers.z.setValue(this.position.z);
  
    this.rotationControllers.x.setValue(this.rotation.x);
    this.rotationControllers.y.setValue(this.rotation.y);
    this.rotationControllers.z.setValue(this.rotation.z);
  
    this.scaleControllers.x.setValue(this.scale.x);
    this.scaleControllers.y.setValue(this.scale.y);
    this.scaleControllers.z.setValue(this.scale.z);
  }

  updateModelMatrix() {
    // Get the selected object
    const object = this.objects[this.selectedObjectIndex];
  
    // Convert rotation angles from degrees to radians
    const rotationRadians = {
      x: this.rotation.x * (Math.PI / 180),
      y: this.rotation.y * (Math.PI / 180),
      z: this.rotation.z * (Math.PI / 180)
    };
  
    // Update the object's model matrix
    mat4.fromRotationTranslationScale(
      object.modelMatrix,
      quat.fromEuler(quat.create(), rotationRadians.x, rotationRadians.y, rotationRadians.z),
      [this.position.x, this.position.y, this.position.z],
      [this.scale.x, this.scale.y, this.scale.z]
    );
  }
}

// Helper function to extract translation and rotation from a model matrix
function extractTranslationRotationScale(modelMatrix) {
  const translation = new Float32Array(3);
  const rotation = new Float32Array(3);
  const scale = new Float32Array(3);
  mat4.getTranslation(translation, modelMatrix);
  const rotationQuat = quat.create();
  mat4.getRotation(rotationQuat, modelMatrix);
  quatToEuler(rotation, rotationQuat); // Convert quaternion to Euler angles
  mat4.getScaling(scale, modelMatrix);

  return {
    position: {
      x: translation[0],
      y: translation[1],
      z: translation[2]
    },
    rotation: {
      x: rotation[0],
      y: rotation[1],
      z: rotation[2]
    },
    scale: {
      x: scale[0],
      y: scale[1],
      z: scale[2]
    }
  };
}

function quatToEuler(out, q) {
  const ysqr = q[1] * q[1];

  // Roll (x-axis rotation)
  const t0 = 2.0 * (q[3] * q[0] + q[1] * q[2]);
  const t1 = 1.0 - 2.0 * (q[0] * q[0] + ysqr);
  out[0] = Math.atan2(t0, t1);

  // Pitch (y-axis rotation)
  let t2 = 2.0 * (q[3] * q[1] - q[2] * q[0]);
  t2 = t2 > 1.0 ? 1.0 : t2;
  t2 = t2 < -1.0 ? -1.0 : t2;
  out[1] = Math.asin(t2);

  // Yaw (z-axis rotation)
  const t3 = 2.0 * (q[3] * q[2] + q[0] * q[1]);
  const t4 = 1.0 - 2.0 * (ysqr + q[2] * q[2]);
  out[2] = Math.atan2(t3, t4);

  // Convert to degrees
  out[0] *= 180 / Math.PI;
  out[1] *= 180 / Math.PI;
  out[2] *= 180 / Math.PI;
}