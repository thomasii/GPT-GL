import { Scene } from './Scene.js';
import { Geometry } from './geometry.js';
import { Lighting } from './lighting.js';
import { mat4 } from 'gl-matrix';
import { Camera } from './camera.js';
import { createModelViewProjectionMatrix } from './transformations.js';
import { generateCube } from './cube.js';

export class MyScene extends Scene {
  constructor(canvas) {
    super(canvas);

    // Create a new lighting object
    this.lighting = new Lighting([10, 10, 10], [1, 0, 1], 1);

    // Create objects and add them to the scene
    this.objects = [
      {
        geometry: new Geometry(this.gl, this.program, generateCube()),
        modelMatrix: mat4.create()
      },
      // Add more objects here
    ];

    // Create camera and set initial position and rotation speeds
    this.camera = new Camera([0, 0, -5], 0.05, 0.1);
  }

  drawScene() {
    // Clear the canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

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
}