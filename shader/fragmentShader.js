export const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 v_position;
in vec3 v_normal;
in vec2 v_texcoord;

uniform sampler2D u_diffuseTexture;
uniform vec3 u_lightPosition;
uniform vec3 u_lightColor;
uniform float u_lightIntensity;
uniform float u_ambientIntensity;

out vec4 outColor;

void main() {
  vec3 lightDirection = normalize(u_lightPosition - v_position);
  vec3 normal = normalize(v_normal);
  vec3 viewDirection = normalize(-v_position);
  vec3 reflectDirection = reflect(-lightDirection, normal);

  float diffuse = max(dot(normal, lightDirection), 0.0);
  vec3 diffuseColor = u_lightColor * u_lightIntensity * diffuse;

  vec3 ambientColor = u_lightColor * u_ambientIntensity;

  vec3 textureColor = texture(u_diffuseTexture, v_texcoord).rgb;
  vec3 color = textureColor;

  outColor = vec4((diffuseColor + ambientColor) * color, 1.0);
}
`;