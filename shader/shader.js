// shader.js
export function createShaderProgram(gl, vertexShaderSource, fragmentShaderSource,uniformNames) {
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

// Store uniform locations
program.uniformLocations = {};
for (const uniformName of uniformNames) {
  program.uniformLocations[uniformName] = gl.getUniformLocation(program, uniformName);
}

// Return the shader program
return program;
}

export function setLighting(gl, program, lighting) {
  const lightingUniform = gl.getUniformLocation(program, "u_lightSourcePosition");
  gl.uniform3fv(lightingUniform, lighting.position);

  const colorUniform = gl.getUniformLocation(program, "u_lightColor");
  gl.uniform3fv(colorUniform, lighting.color);

  const intensityUniform = gl.getUniformLocation(program, "u_lightIntensity");
  gl.uniform1f(intensityUniform, lighting.intensity);

  const ambientIntensityUniform = gl.getUniformLocation(program, "u_ambientIntensity");
  gl.uniform1f(ambientIntensityUniform, lighting.ambientIntensity);
}