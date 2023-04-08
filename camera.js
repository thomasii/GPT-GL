import { mat4 } from 'gl-matrix';

export class Camera {
    constructor(position, rotationSpeed, moveSpeed) {
      this.position = position;
      this.rotation = [0, 0];
      this.rotateSpeed = rotationSpeed;
      this.moveSpeed = moveSpeed;
  
      window.addEventListener('keydown', (event) => this.handleKeyInput(event));
    }
  
    handleKeyInput(event) {
      switch (event.key) {
        case 'ArrowUp':
          this.position[1] += this.moveSpeed;
          break;
        case 'ArrowDown':
          this.position[1] -= this.moveSpeed;
          break;
        case 'ArrowLeft':
          this.rotation[1] -= this.rotateSpeed;
          break;
        case 'ArrowRight':
          this.rotation[1] += this.rotateSpeed;
          break;
      }
    }
  
    getViewMatrix() {
      const viewMatrix = mat4.create();
      mat4.translate(viewMatrix, viewMatrix, this.position);
      mat4.rotateY(viewMatrix, viewMatrix, this.rotation[1]);
      return viewMatrix;
    }
  }