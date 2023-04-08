import { generateRandomCube } from './geometry.js';
import { createBuffer } from './buffer.js';
import { createShaderProgram } from './shader.js';
import { setupAttribute } from './attribute.js';
import { vertexShaderSource } from './vertexShader.js';
import { fragmentShaderSource } from './fragmentShader.js';
import { Lighting } from './lighting.js';
import { mat4 } from 'gl-matrix';
import { Camera } from './camera.js';
import { createModelViewProjectionMatrix } from './transformations.js';

// Initialize WebGL
const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");
console.log("WebGL context:", gl);

// Set the clear color and clear the canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Create a new lighting object
const lightPosition = [0, 1, 0];
const lightColor = [1, 0, 1];
const lightIntensity = 1;
const lighting = new Lighting(lightPosition, lightColor, lightIntensity);

// Generate a random cube
const vertices = generateRandomCube();

// Create a buffer to store the vertex data
const buffer = createBuffer(gl, new Float32Array(vertices));

// Create the shader program
const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

// Use the shader program
gl.useProgram(program);

// Set up the position attribute
const positionAttributeLocation = gl.getAttribLocation(program, "position");
console.log("Position attribute location:", positionAttributeLocation);
setupAttribute(gl, program, buffer, "position", 3, gl.FLOAT, false, 0, 0);

// Set up the lighting uniforms
lighting.setupUniforms(gl, program);

// Create a model matrix for the cube and place it in the scene
const modelMatrix = mat4.create();
mat4.translate(modelMatrix, modelMatrix, [0, 0, 0]);

// Create camera and set initial position and rotation speeds
const camera = new Camera([0, 0, -5], 0.05, 0.1);

function drawScene() {
  // Update the model-view-projection matrix
  const modelViewProjectionMatrix = createModelViewProjectionMatrix(canvas, camera, modelMatrix);

  // Set up the model-view-projection matrix uniform
  const modelViewProjectionMatrixUniformLocation = gl.getUniformLocation(program, "u_modelViewProjectionMatrix");
  gl.uniformMatrix4fv(modelViewProjectionMatrixUniformLocation, false, modelViewProjectionMatrix);

  // Draw the cube
  const primitiveType = gl.TRIANGLES;
  const offsetIndex = 0;
  const count = vertices.length / 3;
  gl.drawArrays(primitiveType, offsetIndex, count);

  // Request the next frame to continuously update the camera position
  requestAnimationFrame(drawScene);
}

// Start drawing the scene
drawScene();