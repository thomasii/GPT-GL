// loadTexture.js
import { TextureSet } from './TextureSet.js';

export async function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = url;
  await new Promise((resolve, reject) => {
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      resolve();
    };
    image.onerror = () => {
      console.error(`Failed to load image: ${url}`);
      reject();
    };
  });

  return texture;
}

// loadTexture.js

export async function setupTextureSet(gl, textureSetDefinitions) {
  const promises = textureSetDefinitions.map(async definition => {
    const diffuseTexture = await loadTexture(gl, definition.diffuse);
    const normalTexture = await loadTexture(gl, definition.normal);
    const specularTexture = await loadTexture(gl, definition.specular);
    console.log(definition)
    return new TextureSet(diffuseTexture, normalTexture, specularTexture);
  });

  return await Promise.all(promises);
}