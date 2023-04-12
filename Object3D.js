import { mat4, vec3, quat } from 'gl-matrix';
import { quatToEuler } from './transformations/quatToEuler.js';
import { setupTextures } from './textures/loadTexture.js';

export class Object3D {
  constructor(geometry, modelMatrix, texturePaths) {
    this.geometry = geometry;
    this.modelMatrix = modelMatrix;
    this.texturePaths = texturePaths;
    this.textures = [];

    // Add position, rotation, and scale properties
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.scale = vec3.fromValues(1, 1, 1);

    // Update position, rotation, and scale from the modelMatrix
    const rotationQuat = quat.create();
    mat4.getTranslation(this.position, this.modelMatrix);
    mat4.getRotation(rotationQuat, this.modelMatrix);
    mat4.getScaling(this.scale, this.modelMatrix);

    // Convert rotation from quaternion to Euler angles (in degrees)
    quatToEuler(this.rotation, rotationQuat);
    vec3.scale(this.rotation, this.rotation, 180 / Math.PI);
  }

  async setupTextures(gl, program) {
    this.textures = await setupTextures(gl, program, this.texturePaths);
  }


  createObjects(loadedTextures) {
    const [diffuseTexture, normalTexture, specularTexture] = loadedTextures;
  
    this.objects = [
      // Use loadedTextures instead of file paths
      // ...
    ];
  }

}