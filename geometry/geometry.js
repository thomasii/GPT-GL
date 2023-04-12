import { setupAttribute } from '../attributes/attribute.js';

class Geometry {
  constructor(gl, program, data) {
    this.gl = gl;
    this.program = program;

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW);
    setupAttribute(gl, program, this.vertexBuffer, 'position', 3, gl.FLOAT, false, 0, 0);

    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.normals), gl.STATIC_DRAW);
    setupAttribute(gl, program, this.normalBuffer, 'normal', 3, gl.FLOAT, false, 0, 0);

    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.colors), gl.STATIC_DRAW);
    setupAttribute(gl, program, this.colorBuffer, 'color', 3, gl.FLOAT, false, 0, 0);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);

    this.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.textureCoords), gl.STATIC_DRAW);
    setupAttribute(gl, program, this.textureCoordBuffer, 'a_texCoord', 2, gl.FLOAT, false, 0, 0);

    this.indexCount = data.indices.length;
  }

  draw(gl) {
    // Bind vertexBuffer and set position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    setupAttribute(gl, this.program, this.vertexBuffer, 'position', 3, gl.FLOAT, false, 0, 0);
  
    // Bind normalBuffer and set normal attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    setupAttribute(gl, this.program, this.normalBuffer, 'normal', 3, gl.FLOAT, false, 0, 0);
  
    // Bind colorBuffer and set color attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    setupAttribute(gl, this.program, this.colorBuffer, 'color', 3, gl.FLOAT, false, 0, 0);
  
    // Bind textureCoordBuffer and set a_texCoord attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    setupAttribute(gl, this.program, this.textureCoordBuffer, 'a_texCoord', 2, gl.FLOAT, false, 0, 0);
  
    // Bind indexBuffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  
    // Draw elements
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}

export { Geometry };