import { Scene } from './Scene.js';
import { Geometry } from '../geometry/geometry.js';
import { Lighting } from '../lighting/lighting.js';
import { mat4, quat } from 'gl-matrix';
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
    this.lighting = new Lighting([30, 70, 100], [1, 1, 1], 1);

    this.objects = [
      new Object3D(new Geometry(this.gl, this.program, generateCube()), mat4.create()),
      new Object3D(new Geometry(this.gl, this.program, generateCube()), mat4.fromRotationTranslationScale(mat4.create(), quat.create(), [0, 0, -4], [4, 4, 0.1])),
      new Object3D(new Geometry(this.gl, this.program, generateCube()), mat4.fromRotationTranslationScale(mat4.create(), quat.create(), [0, -2.5, 0], [4, 0.1, 4])),
    ];

    //const terrainData = generateTerrain(100, 100, 3, 100, 100);
    //const terrainGeometry = new Geometry(this.gl, this.program, terrainData);
    //const terrainObject = new Object3D(terrainGeometry, mat4.create());
    //this.objects.push(terrainObject);



    this.camera = new Camera([0, 0, 10], 0.05, 0.1);

    this.selectedObjectIndex = 1;

    this.objectGUI = new ObjectGUI(this, this.objects, this.requestRender.bind(this));
    this.lightingGUI = new LightingGUI(this, this.lighting);
  }

  drawScene() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.lighting.setupUniforms(this.gl, this.program);

    for (const object of this.objects) {
      this.drawObject(object);
    }

    requestAnimationFrame(() => this.drawScene());
  }

  drawObject(object) {
    const modelViewProjectionMatrix = createModelViewProjectionMatrix(this.gl.canvas, this.camera, object.modelMatrix);
  
    const modelViewProjectionMatrixUniform = this.gl.getUniformLocation(this.program, "u_modelViewProjectionMatrix");
    this.gl.uniformMatrix4fv(modelViewProjectionMatrixUniform, false, modelViewProjectionMatrix);
  
    object.geometry.draw(this.gl);
  }
}