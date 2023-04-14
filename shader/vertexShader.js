export const vertexShaderSource = `#version 300 es
precision mediump float;

in vec3 position;
in vec3 normal;
in vec2 a_texCoord;
in vec3 a_color;

uniform mat4 u_modelViewProjectionMatrix;
uniform vec3 u_lightSourcePositions[4];

uniform mat4 u_modelMatrix; // Add this line

out vec3 v_position;
out vec3 v_normal;
out vec3 v_surfaceToLight[4];
out vec3 v_surfaceToView;
out vec2 v_texcoord;
out vec3 v_color;

out vec3 v_worldPosition; // Add this line
out vec3 v_worldNormal; // Add this line

void main() {
  gl_Position = u_modelViewProjectionMatrix * vec4(position, 1.0);
  v_position = position;
  v_normal = normal;
  v_texcoord = a_texCoord;
  v_color = a_color;

  v_worldPosition = (u_modelMatrix * vec4(position, 1.0)).xyz; // Add this line
  v_worldNormal = (u_modelMatrix * vec4(normal, 0.0)).xyz; // Add this line

  for (int i = 0; i < 4; i++) {
    v_surfaceToLight[i] = u_lightSourcePositions[i] - v_worldPosition; // Update this line
  }

  v_surfaceToView = -v_worldPosition; // Update this line
}
`;