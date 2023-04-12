export class Lighting {
  constructor(lights) {
    this.lights = lights;
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
    const numLights = this.lights.length;
    gl.uniform1i(gl.getUniformLocation(program, "u_numLights"), numLights);

    for (let i = 0; i < numLights; i++) {
      const light = this.lights[i];
      gl.uniform3fv(gl.getUniformLocation(program, `u_lightSourcePositions[${i}]`), light.position);
      gl.uniform3fv(gl.getUniformLocation(program, `u_lightColors[${i}]`), light.color);
      gl.uniform1f(gl.getUniformLocation(program, `u_lightIntensities[${i}]`), light.intensity);
      gl.uniform1f(gl.getUniformLocation(program, `u_ambientIntensities[${i}]`), light.ambientIntensity);
    }
  }

  setAmbientIntensity(ambientIntensity) {
    this.ambientIntensity = ambientIntensity;
  }
}