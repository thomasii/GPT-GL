// shader.js
export function createShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
  // Compile the vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertexShader));
    return null;
  }

  // Compile the fragment shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fragmentShader));
    return null;
  }

  // Link the shader program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }

  // Return the shader program
  return program;
}

export function setLighting(gl, program, lighting) {
  const lightingUniform = gl.getUniformLocation(program, "lighting.position");
  gl.uniform3fv(lightingUniform, lighting.position);

  const colorUniform = gl.getUniformLocation(program, "lighting.color");
  gl.uniform3fv(colorUniform, lighting.color);

  const intensityUniform = gl.getUniformLocation(program, "lighting.intensity");
  gl.uniform1f(intensityUniform, lighting.intensity);
}