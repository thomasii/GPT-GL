export const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 v_position;
in vec3 v_normal;
in vec3 v_lightDirection;

uniform vec3 u_lightColor;
uniform float u_lightIntensity;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);
  float light = max(0.0, dot(normal, v_lightDirection));
  vec3 color = u_lightColor * light * u_lightIntensity;

  outColor = vec4(color, 1.0);
}
`;