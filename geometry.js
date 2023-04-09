import { setupAttribute } from './attribute.js';
import { createBuffer } from './buffer.js';

export class Geometry {
  constructor(gl, program, vertices) {
    this.buffer = createBuffer(gl, new Float32Array(vertices));
    this.vertexCount = vertices.length / 3;

    // Set up the position attribute
    setupAttribute(gl, program, this.buffer, "a_position", 3, gl.FLOAT, false, 0, 0);
  }

  draw(gl) {
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
  }
}