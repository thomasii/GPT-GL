import { MyScene } from './scene/MyScene.js';

const canvas = document.querySelector('#canvas');

(async () => {
  const scene = new MyScene(canvas);
})();