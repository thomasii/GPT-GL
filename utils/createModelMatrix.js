import { mat4, quat, vec3 } from 'gl-matrix';

export function createModelMatrix(position, rotation, scale) {
  const modelMatrix = mat4.create();
  const rotationQuat = quat.create();

  quat.fromEuler(rotationQuat, rotation[0], rotation[1], rotation[2]);
  mat4.fromRotationTranslationScale(modelMatrix, rotationQuat, position, scale);

  return modelMatrix;
}