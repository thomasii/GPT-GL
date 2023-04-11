function setupAttribute(gl, program, buffer, attributeName, size, type, normalized, stride, offset) {
  // Bind the buffer to the ARRAY_BUFFER target
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  // Enable the attribute
  const attributeLocation = gl.getAttribLocation(program, attributeName);
  gl.enableVertexAttribArray(attributeLocation);

  // Describe the buffer layout to the attribute
  gl.vertexAttribPointer(attributeLocation, size, type, normalized, stride, offset);
}

export { setupAttribute };