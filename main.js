import { MyScene } from './scene/MyScene.js';

const canvas = document.querySelector('#canvas');


const textureSetDefinitions = [
  {
    diffuse: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/1024px-Cat_August_2010-4.jpg',
    normal:  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/1024px-Cat_August_2010-4.jpg',
    specular:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/1024px-Cat_August_2010-4.jpg'
  },
  {
    diffuse: 'https://upload.wikimedia.org/wikipedia/en/a/af/PogChamp_emoji.png',
    normal:  'https://upload.wikimedia.org/wikipedia/en/a/af/PogChamp_emoji.png',
    specular:'https://upload.wikimedia.org/wikipedia/en/a/af/PogChamp_emoji.png'
  },
  // ...
];


(async () => {
  const scene = new MyScene(canvas,textureSetDefinitions);
})();