import { mat4,vec3 } from 'gl-matrix';

export function generateTree(depth, length, radius) {
    const vertices = [];
    const indices = [];
    const angles = [];
    const stacks = [];
  
    function generateBranch(depth, length, radius, angle, stack) {
      const segments = 8;
      const position = [0, length, 0];
      const matrix = mat4.create();
      mat4.rotateX(matrix, matrix, angle[0]);
      mat4.rotateY(matrix, matrix, angle[1]);
      mat4.rotateZ(matrix, matrix, angle[2]);
      mat4.translate(matrix, matrix, position);
  
      if (depth === 0) {
        for (let i = 0; i < segments; i++) {
          const theta = (i / segments) * 2 * Math.PI;
          const x = radius * Math.sin(theta);
          const y = 0;
          const z = radius * Math.cos(theta);
          const vertex = vec3.fromValues(x, y, z);
          vec3.transformMat4(vertex, vertex, matrix);
          vertices.push(vertex[0], vertex[1], vertex[2]);
        }
  
        return;
      }
  
      const lengthRatio = 0.7;
      const radiusRatio = 0.7;
      const angleRatio = 0.7;
      const angleX = Math.random() * 2 * Math.PI * angleRatio;
      const angleY = Math.random() * 2 * Math.PI * angleRatio;
      const angleZ = Math.random() * 2 * Math.PI * angleRatio;
      angles.push([angleX, angleY, angleZ]);
      const stackRatio = 0.7;
      const stackDelta = (length / depth) * stackRatio;
      const nextStack = stack + stackDelta;
      stacks.push(nextStack);
  
      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * 2 * Math.PI;
        const x = radius * Math.sin(theta);
        const y = 0;
        const z = radius * Math.cos(theta);
        const vertex = vec3.fromValues(x, y, z);
        vec3.transformMat4(vertex, vertex, matrix);
        vertices.push(vertex[0], vertex[1], vertex[2]);
  
        const nextLength = length * lengthRatio;
        const nextRadius = radius * radiusRatio;
        const nextAngle = angles[angles.length - 1];
        const nextStack = stacks[stacks.length - 1];
        generateBranch(depth - 1, nextLength, nextRadius, nextAngle, nextStack);
      }
    }
  
    generateBranch(depth, length, radius, [0, 0, 0], 0);
  
    for (let i = 0; i < vertices.length / 3; i++) {
      indices.push(i);
    }
  
    return {
      vertices,
      indices,
    };
  }