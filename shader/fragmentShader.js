export const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 v_position;
in vec3 v_normal;
in vec2 v_texcoord;
in vec3 v_color;

in vec3 v_worldNormal; // Add this line

uniform sampler2D u_diffuseTexture;
uniform sampler2D u_normalTexture;
uniform sampler2D u_specularTexture;

uniform vec3 u_lightColors[4];
uniform float u_lightIntensities[4];
uniform float u_ambientIntensities[4];
uniform int u_numLights;

out vec4 outColor;

in vec3 v_surfaceToLight[4]; // Add this line
in vec3 v_surfaceToView; // Add this line

void main() {

  vec3 normalFromMap = texture(u_normalTexture, v_texcoord).rgb * 2.0 - 1.0;
  vec3 normal = normalize(v_worldNormal * normalFromMap);

  float shininess = 12.0; // You can set this value as a uniform if you want to control it from the application side
  vec3 specularColor = texture(u_specularTexture, v_texcoord).rgb;

  vec3 totalSpecular = vec3(0, 0, 0);

  vec3 viewDirection = normalize(v_surfaceToView); // Change this line
  vec3 textureColor = texture(u_diffuseTexture, v_texcoord).rgb;
  vec3 color = mix(textureColor, v_color, 0.5);

  vec3 totalAmbient = vec3(0, 0, 0);
  vec3 totalDiffuse = vec3(0, 0, 0);

  for (int i = 0; i < 4; i++) {
    if (i >= u_numLights) break;

    vec3 lightDirection = normalize(v_surfaceToLight[i]);
    vec3 ambient = u_lightColors[i] * u_ambientIntensities[i];
    vec3 diffuse = u_lightColors[i] * u_lightIntensities[i] * max(dot(normal, lightDirection), 0.0);

    vec3 halfVector = normalize(lightDirection + viewDirection);
    float specFactor = pow(max(dot(normal, halfVector), 0.0), shininess);
    vec3 specular = u_lightColors[i] * u_lightIntensities[i] * specFactor * specularColor;
  
    totalSpecular += specular;
    totalAmbient += ambient;
    totalDiffuse += diffuse;
  }

  outColor = vec4((totalDiffuse + totalAmbient + totalSpecular) * color, 1.0);
}
`;