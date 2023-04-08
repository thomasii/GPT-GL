class Lighting {
  constructor(position, color, intensity) {
    this.position = position;
    this.color = color;
    this.intensity = intensity;
  }

  setPosition(position) {
    this.position = position;
  }

  setColor(color) {
    this.color = color;
  }

  setIntensity(intensity) {
    this.intensity = intensity;
  }

  setupUniforms(gl, program) {
    const lightingUniform = gl.getUniformLocation(program, "u_lightPosition");
    gl.uniform3fv(lightingUniform, this.position);

    const colorUniform = gl.getUniformLocation(program, "u_lightColor");
    gl.uniform3fv(colorUniform, this.color);

    const intensityUniform = gl.getUniformLocation(program, "u_lightIntensity");
    gl.uniform1f(intensityUniform, this.intensity);
  }
}

export { Lighting };