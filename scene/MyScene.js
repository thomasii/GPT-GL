import { Scene } from './Scene.js';
import { Geometry } from '../geometry/geometry.js';
import { Material } from '../material/Material.js';
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
    this.lighting = new Lighting([
      { position: [100, 100, -100], color: [1, 1, 1], intensity: 1, ambientIntensity: 0.1 },
      { position: [-100, 100, -100], color: [1, 0, 0], intensity: 0.5, ambientIntensity: 0.05 }
    ]);
  
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
    const urlWoodDiffuse = "https://i.postimg.cc/cdbjq8sm/AT-Wood-01-4096x2560-DIFF.jpg";
    const urlWoodNorm = "https://i.postimg.cc/GrwWhYvg/AT-Wood-01-4096x2560-NORM.jpg";
    const urlWoodSpec = "https://i.postimg.cc/7YQBypy6/AT-Wood-01-4096x2560-SPEC.jpg";

    
    const urlStoneDiffuse = "https://i.postimg.cc/65kBpbrW/Stylized-Stone-Floor-005-basecolor.jpg"
    const urlStoneNorm = "https://i.postimg.cc/Bn24L5px/Stylized-Stone-Floor-005-normal.jpg"
    const urlStoneSpec = "https://i.postimg.cc/pXh2xMnc/Stylized-Stone-Floor-005-height.png"


    const diffuseTextureWood = await loadTexture(this.gl, urlWoodDiffuse);
    const normalTextureWood = await loadTexture(this.gl, urlWoodNorm);
    const specularTextureWood = await loadTexture(this.gl, urlWoodSpec);
    
    const materialWood = new Material();
    materialWood.setDiffuseTexture(diffuseTextureWood);
    materialWood.setNormalTexture(normalTextureWood);
    materialWood.setSpecularTexture(specularTextureWood);
    
    this.materialWood = materialWood;

    //Load new textures!

    const diffuseTextureStone = await loadTexture(this.gl, urlStoneDiffuse);
    const normalTextureStone = await loadTexture(this.gl, urlStoneNorm);
    const specularTextureStone = await loadTexture(this.gl, urlStoneSpec);

    const materialStone = new Material();
    materialStone.setDiffuseTexture(diffuseTextureStone);
    materialStone.setNormalTexture(normalTextureStone);
    materialStone.setSpecularTexture(specularTextureStone);
    
    this.materialStone = materialStone;
  }
  
  createObjects() {

    this.objects = [
      // Cube 1
      new Object3D(
        new Geometry(this.gl, this.program, generateCube()),
        mat4.fromTranslation(mat4.create(), vec3.fromValues(-2.0, 0.0, 0.0)),
        this.materialWood
      ),
      // Cube 2
      new Object3D(
        new Geometry(this.gl, this.program, generateCube()),
        mat4.fromTranslation(mat4.create(), vec3.fromValues(2.0, 0.0, 0.0)),
        this.materialStone
      ),
      // Cube 3
      new Object3D(
        new Geometry(this.gl, this.program, generateCube()),
        mat4.fromTranslation(mat4.create(), vec3.fromValues(0.0, 2.0, 0.0)),
        this.materialWood
      ),
      // Cube 4
      new Object3D(
        new Geometry(this.gl, this.program, generateCube()),
        mat4.fromTranslation(mat4.create(), vec3.fromValues(0.0, -2.0, 0.0)),
        this.materialStone
      ),
    ];

    const terrainData = generateTerrain(100, 100, 30, 100, 100);
    const terrainGeometry = new Geometry(this.gl, this.program, terrainData);
    const terrainObject = new Object3D(terrainGeometry, mat4.create(),
    this.materialStone
    );
    this.objects.push(terrainObject);


  }

  bindMaterial(material) {
    // Bind the textures to their respective texture units
    if (material.diffuseTexture) {
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, material.diffuseTexture);
    }
    if (material.normalTexture) {
      this.gl.activeTexture(this.gl.TEXTURE1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, material.normalTexture);
    }
    if (material.specularTexture) {
      this.gl.activeTexture(this.gl.TEXTURE2);
      this.gl.bindTexture(this.gl.TEXTURE_2D, material.specularTexture);
    }
  
    //this.gl.uniform1i(u_diffuseTextureLocation, 0);
    //this.gl.uniform1i(u_normalTextureLocation, 1);
    //this.gl.uniform1i(u_specularTextureLocation, 2);
  
    // You can also set other uniform values, such as colors or shininess
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
    // Bind the material before drawing
    this.bindMaterial(object.material);
  
    const modelViewProjectionMatrix = createModelViewProjectionMatrix(this.gl.canvas, this.camera, object.modelMatrix);
  
    // Set the u_modelMatrix uniform value
    const u_modelMatrixLocation = this.gl.getUniformLocation(this.program, 'u_modelMatrix');
    this.gl.uniformMatrix4fv(u_modelMatrixLocation, false, object.modelMatrix);

    const modelViewProjectionMatrixUniform = this.gl.getUniformLocation(this.program, "u_modelViewProjectionMatrix");
    this.gl.uniformMatrix4fv(modelViewProjectionMatrixUniform, false, modelViewProjectionMatrix);
  
    object.geometry.draw(this.gl);
  }
}