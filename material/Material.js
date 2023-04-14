export class Material {
    constructor() {
      this.diffuseTexture = null;
      this.normalTexture = null;
      this.specularTexture = null;
      // You can add other properties like colors, shininess, etc.
    }
  
    setDiffuseTexture(texture) {
      this.diffuseTexture = texture;
    }
  
    setNormalTexture(texture) {
      this.normalTexture = texture;
    }
  
    setSpecularTexture(texture) {
      this.specularTexture = texture;
    }
  }