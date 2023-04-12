import { createShaderProgram } from '../shader/shader.js';
import { vertexShaderSource } from '../shader/vertexShader.js';
import { fragmentShaderSource } from '../shader/fragmentShader.js';

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

    // Set the blend factor for vertex color and texture color
    const blendFactorLocation = this.gl.getUniformLocation(this.program, "u_blendFactor");
    this.gl.useProgram(this.program);
    this.gl.uniform1f(blendFactorLocation, 0.5); // Set the blend factor to 0.5 as an example
  }d

  drawScene() {
    // Set up lighting and objects specific to each scene
    // To be implemented in derived classes
  }

  createSceneObject(vertices, modelMatrix) {
    // Create a new object and add it to the scene
    // To be implemented in derived classes
  }

  requestRender() {
    // Request a new frame to be rendered
    requestAnimationFrame(() => this.drawScene());
  }
}