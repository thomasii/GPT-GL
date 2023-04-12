export const vertexShaderSource = `#version 300 es
precision mediump float;

in vec3 position;
in vec3 normal;
in vec2 a_texCoord;

uniform mat4 u_modelViewProjectionMatrix;
uniform vec3 uLightSourcePosition;

out vec3 v_position;
out vec3 v_normal;
out vec3 v_lightDirection;
out vec2 v_texcoord;

void main() {
  gl_Position = u_modelViewProjectionMatrix * vec4(position, 1.0);
  v_position = position;
  v_normal = normal;
  v_texcoord = a_texCoord;
  v_lightDirection = normalize(uLightSourcePosition - position);
}
`;