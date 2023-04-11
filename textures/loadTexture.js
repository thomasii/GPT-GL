// loadTexture.js
export async function loadTexture(gl, program, url) {
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

export async function setupTextures(gl, program, textureUrls) {
  const textures = [];
  for (const url of textureUrls) { 
    const texture = await loadTexture(gl, program, url);
    textures.push(texture);
  }

  const textureUniforms = ["u_diffuseTexture", "u_normalTexture", "u_specularTexture"];

  for (let i = 0; i < textures.length; i++) {
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, textures[i]);
    const textureUniformLocation = gl.getUniformLocation(program, textureUniforms[i ]);
    gl.uniform1i(textureUniformLocation, i);
  }

  return textures;
}