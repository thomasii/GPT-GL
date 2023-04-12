export const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 v_position;
in vec3 v_normal;
in vec2 v_texcoord;
in vec3 v_color;

flat in int v_textureSetIndex;

uniform sampler2D u_diffuseTexture0;
uniform sampler2D u_diffuseTexture1;

uniform vec3 u_lightColors[4];
uniform float u_lightIntensities[4];
uniform float u_ambientIntensities[4];
uniform int u_numLights;

out vec4 outColor;

in vec3 v_surfaceToLight[4];
in vec3 v_surfaceToView;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 viewDirection = normalize(v_surfaceToView);

  vec3 textureColor;
  if (v_textureSetIndex == 0) {
    textureColor = texture(u_diffuseTexture0, v_texcoord).rgb;
  } else if (v_textureSetIndex == 1) {
    textureColor = texture(u_diffuseTexture1, v_texcoord).rgb;
  }
  
  vec3 color = mix(textureColor, v_color, 0.5);

  vec3 totalAmbient = vec3(0, 0, 0);
  vec3 totalDiffuse = vec3(0, 0, 0);

  for (int i = 0; i < 4; i++) {
    if (i >= u_numLights) break;

    vec3 lightDirection = normalize(v_surfaceToLight[i]);
    vec3 ambient = u_lightColors[i] * u_ambientIntensities[i];
    vec3 diffuse = u_lightColors[i] * u_lightIntensities[i] * max(dot(normal, lightDirection), 0.0);

    totalAmbient += ambient;
    totalDiffuse += diffuse;
  }

  outColor = vec4((totalDiffuse + totalAmbient) * color, 1.0);
}
`;