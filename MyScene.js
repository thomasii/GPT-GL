import { Scene } from './Scene.js';
import { setupAttribute } from './attribute.js';
import { createBuffer } from './buffer.js';
import { Lighting } from './lighting.js';
import { mat4 } from 'gl-matrix';
import { Camera } from './camera.js';
import { createModelViewProjectionMatrix } from './transformations.js';
import { generateCube } from './cube.js';

export class MyScene extends Scene {
  constructor(canvas) {
    super(canvas);

    // Create a new lighting object
    this.lighting = new Lighting([0, 1, 0], [1, 0, 1], 1);

    // Create a cube and add it to the scene
    this.createSceneObject(generateCube(), mat4.create());

    // Create camera and set initial position and rotation speeds
    this.camera = new Camera([0, 0, -5], 0.05, 0.1);
  }

  drawScene() {
    // Clear the canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Set up the lighting uniforms
    this.lighting.setupUniforms(this.gl, this.program);

    // Draw objects in the scene
    this.drawObject(this.cube);

    // Request the next frame to continuously update the camera position
    requestAnimationFrame(() => this.drawScene());
  }

  createSceneObject(vertices, modelMatrix) {
    // Create a buffer to store the vertex data
    const buffer = createBuffer(this.gl, new Float32Array(vertices));

    // Set up the position attribute
    setupAttribute(this.gl, this.program, buffer, "a_position", 3, this.gl.FLOAT, false, 0, 0);

    return {
      buffer: buffer,
      vertexCount: vertices.length / 3,
      modelMatrix: modelMatrix
    };
  }

  drawObject(object) {
    // Set up the model-view-projection matrix
    const modelViewProjectionMatrix = createModelViewProjectionMatrix(this.canvas, this.camera, object.modelMatrix);

    // Set the uniform for the model-view-projection matrix
    const modelViewProjectionMatrixUniform = this.gl.getUniformLocation(this.program, "u_modelViewProjectionMatrix");
    this.gl.uniformMatrix4fv(modelViewProjectionMatrixUniform, false, modelViewProjectionMatrix);

    // Draw the object
    this.gl.drawArrays(this.gl.TRIANGLES, 0, object.vertexCount);
  }
}