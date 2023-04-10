import { MyScene } from './myScene.js';

// Get the canvas and create an instance of MyScene
const canvas = document.getElementById("canvas");
const myScene = new MyScene(canvas);

// Start drawing the scene
myScene.drawScene();