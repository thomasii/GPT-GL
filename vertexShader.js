export const vertexShaderSource = `#version 300 es
precision mediump float;

in vec3 a_position;

uniform mat4 u_modelViewProjectionMatrix;
uniform vec3 u_lightPosition;

out vec3 v_position;
out vec3 v_lightDirection;

void main() {
  gl_Position = u_modelViewProjectionMatrix * vec4(a_position, 1.0); 
  v_position = a_position; 
  v_lightDirection = normalize(u_lightPosition - v_position);
}
`;