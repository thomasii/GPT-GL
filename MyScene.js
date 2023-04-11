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
    this.camera = new Camera([0, 0, -10], 0.05, 0.1);

    // Set the selected object index
    this.selectedObjectIndex = 0;

    // Initialize properties for position and rotation
    this.position = { x: 0, y: 0, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0 };

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

    const positionFolder = this.gui.addFolder('Position');
    positionFolder.add(this.position, 'x', -10, 10).name('X').onChange(() => this.updateModelMatrix());
    positionFolder.add(this.position, 'y', -10, 10).name('Y').onChange(() => this.updateModelMatrix());
    positionFolder.add(this.position, 'z', -10, 10).name('Z').onChange(() => this.updateModelMatrix());
    positionFolder.open();

    const rotationFolder = this.gui.addFolder('Rotation');
    rotationFolder.add(this.rotation, 'x', 0, 360).name('Rotate X').onChange(() => this.updateModelMatrix());
    rotationFolder.add(this.rotation, 'y', 0, 360).name('Rotate Y').onChange(() => this.updateModelMatrix());
    rotationFolder.add(this.rotation, 'z', 0, 360).name('Rotate Z').onChange(() => this.updateModelMatrix());
    rotationFolder.open();

  }

  updateModelMatrix() {
    const object = this.objects[this.selectedObjectIndex];
    const translation = mat4.fromTranslation(mat4.create(), [this.position.x, this.position.y, this.position.z]);
    const rotationX = mat4.fromXRotation(mat4.create(), this.rotation.x * (Math.PI / 180));
    const rotationY = mat4.fromYRotation(mat4.create(), this.rotation.y * (Math.PI / 180));
    const rotationZ = mat4.fromZRotation(mat4.create(), this.rotation.z * (Math.PI / 180));
    mat4.multiply(object.modelMatrix, translation, rotationX);
    mat4.multiply(object.modelMatrix, object.modelMatrix, rotationY);
    mat4.multiply(object.modelMatrix, object.modelMatrix, rotationZ);
  }
}