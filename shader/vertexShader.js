export const vertexShaderSource = `#version 300 es
precision mediump float;

in vec3 position;
in vec3 normal;
in vec3 color;

uniform mat4 u_modelViewProjectionMatrix;
uniform vec3 u_lightPosition;

out vec3 v_position;
out vec3 v_normal;
out vec3 v_lightDirection;
out vec3 v_color;

void main() {
  gl_Position = u_modelViewProjectionMatrix * vec4(position, 1.0);
  v_position = position;
  v_normal = normal;
  v_color = color;
  v_lightDirection = normalize(u_lightPosition - v_position);
}
`;