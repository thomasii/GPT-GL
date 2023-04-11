import { Noise } from 'noisejs';

export function generateTerrain(width, depth, height, subdivisionsWidth, subdivisionsDepth) {
  const vertices = [];
  const indices = [];
  const normals = [];
  const colors = [];
  const noise = new Noise(Math.random());

  // Generate vertices
  for (let z = 0; z <= subdivisionsDepth; z++) {
    for (let x = 0; x <= subdivisionsWidth; x++) {
      const xPos = (x / subdivisionsWidth) * width - width / 2;
      const zPos = (z / subdivisionsDepth) * depth - depth / 2;
      const yPos = noise.simplex2(xPos / width, zPos / depth) * height;

      vertices.push(xPos, yPos, zPos);
    }
  }

  // Generate indices
  for (let z = 0; z < subdivisionsDepth; z++) {
    for (let x = 0; x < subdivisionsWidth; x++) {
      const topLeft = z * (subdivisionsWidth + 1) + x;
      const topRight = topLeft + 1;
      const bottomLeft = (z + 1) * (subdivisionsWidth + 1) + x;
      const bottomRight = bottomLeft + 1;

      indices.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight);
    }
  }

  // Generate normals
  for (let i = 0; i < vertices.length; i += 3) {
    const v1 = [vertices[i], vertices[i + 1], vertices[i + 2]];
    const v2 = i > 0 ? [vertices[i - 3], vertices[i - 2], vertices[i - 1]] : v1;
    const v3 = i < vertices.length - 3 ? [vertices[i + 3], vertices[i + 4], vertices[i + 5]] : v1;

    const u = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
    const v = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];

    const normal = [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];

    const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);

    normals.push(normal[0] / length, normal[1] / length, normal[2] / length);
  }

  // Generate colors
  const color1 = [0.0, 0.3, 0.8];
  const color2 = [1.0, 1.0, 1.0];

  for (let i = 0; i < vertices.length; i += 3) {
    const yPos = vertices[i + 1];
    const color = yPos < height / 2 ? color1 : color2;

    colors.push(color[0], color[1], color[2]);
  }

  return {
    vertices,
    indices,
    normals,
    colors,
  };
}