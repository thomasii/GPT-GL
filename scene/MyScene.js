import { Scene } from './Scene.js';
import { Geometry } from '../geometry/geometry.js';
import { Lighting } from '../lighting/lighting.js';
import { TextureSet } from '../textures/TextureSet.js';
import { loadTexture, setupTextureSet } from '../textures/loadTexture.js';
import { mat4, quat, vec3 } from 'gl-matrix';
import { Camera } from '../camera/camera.js';
import { createModelViewProjectionMatrix } from '../transformations/transformations.js';
import { extractTranslationRotationScale } from '../utils/extractTranslationRotationScale.js';
import { generateCube } from '../geometry/cube.js';
import { generateTerrain } from '../geometry/terrain.js';
import { Object3D } from '../Object3D.js';
import { ObjectGUI } from '../ObjectGUI.js';
import { LightingGUI } from '../LightingGUI.js';

export class MyScene extends Scene {
  constructor(canvas, textureSetDefinitions) {
    super(canvas);
    console.log(textureSetDefinitions);
    this.gl.disable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.lighting = new Lighting(
    [
      { position: [100, 100, -100], color: [1, 1, 1], intensity: 1, ambientIntensity: 0.1 },
      { position: [-100, 100, -100], color: [1, 0, 0], intensity: 0.5, ambientIntensity: 0.05 }
    ]);
  
    this.camera = new Camera([0, 0, 10], 0.05, .5);
  
    this.selectedObjectIndex = 0; 

    this.textureSetDefinitions = textureSetDefinitions;

    this.init();
  }

  async init() {
    await this.loadResources();
    
    this.createObjects();
    this.drawScene();
    this.objectGUI = new ObjectGUI(this, this.objects, this.textureSets); // change to this.textureSets
    this.lightingGUI = new LightingGUI(this, this.lighting);
    }

  async loadResources() {

    this.textureSets = await setupTextureSet(this.gl, this.textureSetDefinitions);

  }
  
    createObjects() {
      this.objects = [
        // Cube 1
        new Object3D(
          new Geometry(this.gl, this.program, generateCube()),
          mat4.fromTranslation(mat4.create(), vec3.fromValues(-2.0, 0.0, 0.0)),
          this.textureSets[0] // use 0 texture set
        ),
        // Cube 2
        new Object3D(
          new Geometry(this.gl, this.program, generateCube()),
          mat4.fromTranslation(mat4.create(), vec3.fromValues(2.0, 0.0, 0.0)),
          this.textureSets[1] // use 1 texture set
        ),
        // Cube 3
        new Object3D(
          new Geometry(this.gl, this.program, generateCube()),
          mat4.fromTranslation(mat4.create(), vec3.fromValues(0.0, 2.0, 0.0)),
          this.textureSets[0] // use 2 texture set
        ),
        // Cube 4
        new Object3D(
          new Geometry(this.gl, this.program, generateCube()),
          mat4.fromTranslation(mat4.create(), vec3.fromValues(0.0, -2.0, 0.0)),
          this.textureSets[1] // use 0 texture set
        ),
      ];
    
      //const terrainData = generateTerrain(100, 100, 30, 100, 100);
      //const terrainGeometry = new Geometry(this.gl, this.program, terrainData);
      //const terrainObject = new Object3D(terrainGeometry, mat4.create(), this.textureSets[0]); // use first texture set
      //this.objects.push(terrainObject);
    }
  

  drawScene() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.lighting.setupUniforms(this.gl, this.program);
    
    // In the `drawScene` or `requestRender` method
    const lightPosition = this.lighting.lights[0].position; // Modify this line
    this.setLightSourcePosition(lightPosition[0], lightPosition[1], lightPosition[2]);
    
    for (const object of this.objects) {
      this.drawObject(object);
    }
  
    requestAnimationFrame(() => this.drawScene());
  }

  drawObject(object) {
    // Bind textures and set uniforms
    const textureUniforms = [
      ['u_diffuseTexture0', 'u_normalTexture0', 'u_specularTexture0'],
      ['u_diffuseTexture1', 'u_normalTexture1', 'u_specularTexture1'],
      ['u_diffuseTexture2', 'u_normalTexture2', 'u_specularTexture2'],
      ['u_diffuseTexture3', 'u_normalTexture3', 'u_specularTexture3'],
      // ... add more if needed
    ];
  
    for (let i = 0; i < object.textures.length; i++) {
      const texture = object.textures[i];
      this.gl.activeTexture(this.gl.TEXTURE0 + i);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
  
      const textureUniform = this.program.uniformLocations[textureUniforms[object.textureSetIndex][i]]; // Change this line
      this.gl.uniform1i(textureUniform, i);
    }
  
    const modelViewProjectionMatrix = createModelViewProjectionMatrix(this.gl.canvas, this.camera, object.modelMatrix);
  
    const modelViewProjectionMatrixUniform = this.gl.getUniformLocation(this.program, "u_modelViewProjectionMatrix");
    this.gl.uniformMatrix4fv(modelViewProjectionMatrixUniform, false, modelViewProjectionMatrix);
  
    object.geometry.draw(this.gl);
  }
}