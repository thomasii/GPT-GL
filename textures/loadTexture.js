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
      resolve(texture);
    };
    image.onerror = () => {
      console.error(`Failed to load image: ${url}`);
      // Create a 1x1 white pixel texture as a default texture
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
      gl.generateMipmap(gl.TEXTURE_2D);
      resolve(texture);
    };
  });

  return texture;
}