export const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 v_position;
in vec3 v_lightDirection;

uniform vec3 u_lightColor;
uniform float u_lightIntensity;
uniform float u_ambientIntensity; // Add this line

out vec4 outColor;

void main() {
  vec3 normal = normalize(cross(dFdx(v_position), dFdy(v_position)));
  float light = max(0.0, dot(normal, v_lightDirection));
  vec3 directLight = u_lightColor * light * u_lightIntensity;

  vec3 ambientLight = u_lightColor * u_ambientIntensity; // Add this line

  outColor = vec4(directLight + ambientLight, 1.0); // Modify this line
}
`;