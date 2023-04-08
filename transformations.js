import { mat4 } from 'gl-matrix';

export function createModelViewProjectionMatrix(canvas, camera, modelMatrix) {
  const modelViewProjectionMatrix = mat4.create();
  mat4.perspective(modelViewProjectionMatrix, (45 * Math.PI) / 180, canvas.width / canvas.height, 0.1, 100.0);

  const viewMatrix = camera.getViewMatrix();
  mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, viewMatrix);
  mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix);

  return modelViewProjectionMatrix;
}