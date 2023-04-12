import { Scene } from './Scene.js';
import { Geometry } from '../geometry/geometry.js';
import { Lighting } from '../lighting/lighting.js';
import { loadTexture, setupTextures } from '../textures/loadTexture.js';
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
  constructor(canvas) {
    super(canvas);
    this.gl.disable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.lighting = new Lighting([10, 10, -10], [1, 1, 1], 1);
  
    //const terrainData = generateTerrain(100, 100, 30, 100, 100);
    //const terrainGeometry = new Geometry(this.gl, this.program, terrainData);
    //const terrainObject = new Object3D(terrainGeometry, mat4.create());
    //this.objects.push(terrainObject);
  
    this.camera = new Camera([0, 0, 10], 0.05, .5);
  
    this.selectedObjectIndex = 0; 
    
    this.init();
  }

  async init() {
    await this.loadResources();
    
    this.createObjects();
    this.drawScene();
    this.objectGUI = new ObjectGUI(this, this.objects, this.textures);
    this.lightingGUI = new LightingGUI(this, this.lighting);
  }
  
  async loadResources() {
    this.textures = await setupTextures(this.gl, this.program, 
      
      //[
      //'..\textures\Wood\AT_Wood_01_4096x2560_DIFF.jpg',
      //'..\textures\Wood\AT_Wood_01_4096x2560_NORM.jpg',
      //'..\textures\Wood\AT_Wood_01_4096x2560_SPEC.jpg'
      //]
      [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7mOITsliCBvI8vU14jNXsTBhllOzN_jpaXA&usqp=CAU'
      ]

    );
  }
  
  createObjects() {
    const [diffuseTexture, normalTexture, specularTexture] = this.textures;

    this.objects = [
      // Cube 1
      new Object3D(
        new Geometry(this.gl, this.program, generateCube()),
        mat4.fromTranslation(mat4.create(), vec3.fromValues(-2.0, 0.0, 0.0)),
        [diffuseTexture, normalTexture, specularTexture]
      ),
      // Cube 2
      new Object3D(
        new Geometry(this.gl, this.program, generateCube()),
        mat4.fromTranslation(mat4.create(), vec3.fromValues(2.0, 0.0, 0.0)),
        [diffuseTexture, normalTexture, specularTexture]
      ),
      // Cube 3
      new Object3D(
        new Geometry(this.gl, this.program, generateCube()),
        mat4.fromTranslation(mat4.create(), vec3.fromValues(0.0, 2.0, 0.0)),
        [diffuseTexture, normalTexture, specularTexture]
      ),
      // Cube 4
      new Object3D(
        new Geometry(this.gl, this.program, generateCube()),
        mat4.fromTranslation(mat4.create(), vec3.fromValues(0.0, -2.0, 0.0)),
        [diffuseTexture, normalTexture, specularTexture]
      ),
    ];
  }
  

  drawScene() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.lighting.setupUniforms(this.gl, this.program);
    
    // In the `drawScene` or `requestRender` method
    const lightPosition = this.lighting.position;
    this.setLightSourcePosition(lightPosition[0], lightPosition[1], lightPosition[2]);
    
    for (const object of this.objects) {
      this.drawObject(object);
    }
  
    requestAnimationFrame(() => this.drawScene());
  }

drawObject(object) {
  // Bind textures and set uniforms
  const textureUniforms = ['u_diffuseTexture', 'u_normalTexture', 'u_specularTexture'];
  for (let i = 0; i < object.textures.length; i++) {
    const texture = object.textures[i];
    this.gl.activeTexture(this.gl.TEXTURE0 + i);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    const textureUniform = this.gl.getUniformLocation(this.program, textureUniforms[i]);
    this.gl.uniform1i(textureUniform, i);
  }

  const modelViewProjectionMatrix = createModelViewProjectionMatrix(this.gl.canvas, this.camera, object.modelMatrix);

  const modelViewProjectionMatrixUniform = this.gl.getUniformLocation(this.program, "u_modelViewProjectionMatrix");
  this.gl.uniformMatrix4fv(modelViewProjectionMatrixUniform, false, modelViewProjectionMatrix);

  object.geometry.draw(this.gl);
}
}