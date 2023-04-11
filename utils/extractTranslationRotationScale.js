import { mat4, quat } from 'gl-matrix';
import { quatToEuler } from '../transformations/quatToEuler.js';

// Helper function to extract translation and rotation from a model matrix
export function extractTranslationRotationScale(modelMatrix) {
    const translation = new Float32Array(3);
    const rotation = new Float32Array(3);
    const scale = new Float32Array(3);
    mat4.getTranslation(translation, modelMatrix);
    const rotationQuat = quat.create();
    mat4.getRotation(rotationQuat, modelMatrix);
    quatToEuler(rotation, rotationQuat); // Convert quaternion to Euler angles
    mat4.getScaling(scale, modelMatrix);
  
    return {
      position: {
        x: translation[0],
        y: translation[1],
        z: translation[2]
      },
      rotation: {
        x: rotation[0],
        y: rotation[1],
        z: rotation[2]
      },
      scale: {
        x: scale[0],
        y: scale[1],
        z: scale[2]
      }
    };
  }