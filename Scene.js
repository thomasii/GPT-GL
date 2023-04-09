import { createShaderProgram, setLighting } from './shader.js';
import { vertexShaderSource } from './vertexShader.js';
import { fragmentShaderSource } from './fragmentShader.js';

export class Scene {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl2");
    console.log("WebGL context:", this.gl);

    // Set the clear color and clear the canvas
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Create the shader program
    this.program = createShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    this.gl.useProgram(this.program);
  }

  drawScene() {
    // Set up lighting and objects specific to each scene
    // To be implemented in derived classes
  }

  createSceneObject(vertices, modelMatrix) {
    // Create a new object and add it to the scene
    // To be implemented in derived classes
  }
}