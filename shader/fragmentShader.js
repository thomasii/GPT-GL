// Fragment shader
export const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 v_position;
in vec3 v_normal;
in vec3 v_color;
in vec2 v_texcoord;

uniform sampler2D u_diffuseTexture;
uniform sampler2D u_normalTexture;
uniform sampler2D u_specularTexture;
uniform vec3 u_lightPosition;
uniform vec3 u_lightColor;
uniform float u_lightIntensity;
uniform float u_ambientIntensity;
uniform vec3 u_objectColor;
uniform float u_shininess;

uniform float u_blendFactor; // Add a uniform to control the blending

out vec4 outColor;

void main() {
  vec3 lightDirection = normalize(u_lightPosition - v_position);
  vec3 normal = normalize(v_normal);
  vec3 viewDirection = normalize(-v_position);
  vec3 reflectDirection = reflect(-lightDirection, normal);

  float diffuse = max(dot(normal, lightDirection), 0.0);
  vec3 diffuseColor = u_lightColor * u_lightIntensity * diffuse;

  float specular = 0.0;
  if (diffuse > 0.0) {
    specular = pow(max(dot(reflectDirection, viewDirection), 0.0), u_shininess);
  }
  vec3 specularColor = u_lightColor * u_lightIntensity * specular;

  vec3 ambientColor = u_lightColor * u_ambientIntensity;

  // Blend vertex color with texture color
  vec3 textureColor = texture(u_diffuseTexture, v_texcoord).rgb;
  vec3 color = mix(textureColor, v_color, u_blendFactor);

  vec3 normalMap = texture(u_normalTexture, v_texcoord).rgb;
  normalMap = normalize(normalMap * 2.0 - 1.0);
  mat3 tbnMatrix = mat3(normalize(dFdx(v_position)), normalize(dFdy(v_position)), normalize(normal));
  normal = normalize(tbnMatrix * normalMap);

  vec3 specularMap = texture(u_specularTexture, v_texcoord).rgb;
  specularColor *= specularMap;

  outColor = vec4((diffuseColor + specularColor) * color + ambientColor * color, 1.0);
}
`;