export function generateWall() {
    const vertices = [
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
       1.0,  1.0, 0.0,
      -1.0,  1.0, 0.0,
    ];
  
    const normals = [
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
    ];
  
    const indices = [
      0, 1, 2,
      0, 2, 3,
    ];
  
    return {
      vertices: vertices,
      normals: normals,
      indices: indices,
    };
  }