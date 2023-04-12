export function generateCheckerboardTexture(gl, width, height, tileWidth, tileHeight, color1, color2) {
    const data = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const isTile1 = (((x / tileWidth) ^ (y / tileHeight)) & 1) === 0;
        const color = isTile1 ? color1 : color2;
  
        data.set(color, index);
      }
    }
  
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.generateMipmap(gl.TEXTURE_2D);
  
    return texture;
  }