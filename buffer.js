function createBuffer(gl, data) {
    // Create a new buffer object
    const buffer = gl.createBuffer();
  
    // Bind the buffer object to the ARRAY_BUFFER target
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  
    // Store the vertex data in the buffer
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
    return buffer;
  }
  
  // Export the createBuffer function
  export { createBuffer };