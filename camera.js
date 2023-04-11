import { mat4, quat, vec3 } from 'gl-matrix';

export class Camera {
  constructor(position, rotationSpeed, moveSpeed) {
    this.position = position;
    this.rotation = [0, 0];
    this.rotateSpeed = rotationSpeed;
    this.moveSpeed = moveSpeed;
    this.forward = vec3.create();
    this.right = vec3.create();
    this.up = vec3.fromValues(0, 1, 0);

    window.addEventListener('keydown', (event) => this.handleKeyInput(event));
    window.addEventListener('mousemove', (event) => this.handleMouseMove(event));
  }

  handleKeyInput(event) {
    switch (event.key) {
      case 'w':
        vec3.scaleAndAdd(this.position, this.position, this.forward, this.moveSpeed);
        break;
      case 's':
        vec3.scaleAndAdd(this.position, this.position, this.forward, -this.moveSpeed);
        break;
      case 'a':
        vec3.scaleAndAdd(this.position, this.position, this.right, -this.moveSpeed);
        break;
      case 'd':
        vec3.scaleAndAdd(this.position, this.position, this.right, this.moveSpeed);
        break;
      case ' ':
        vec3.scaleAndAdd(this.position, this.position, this.up, this.moveSpeed);
        break;
      case 'Control':
        vec3.scaleAndAdd(this.position, this.position, this.up, -this.moveSpeed);
        break;
    }
  }

  handleMouseMove(event) {
    const dx = event.movementX * this.rotateSpeed;
    const dy = event.movementY * this.rotateSpeed;
    this.rotation[0] -= dy;
    this.rotation[1] -= dx;
    this.rotation[0] = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation[0]));
  }

  getViewMatrix() {
    quat.identity(tempQuat);
    quat.rotateY(tempQuat, tempQuat, this.rotation[1]);
    quat.rotateX(tempQuat, tempQuat, this.rotation[0]);

    vec3.set(tempVec3, 0, 0, -1);
    vec3.transformQuat(this.forward, tempVec3, tempQuat);
    vec3.normalize(this.forward, this.forward);

    vec3.set(tempVec3, 1, 0, 0);
    vec3.transformQuat(this.right, tempVec3, tempQuat);
    vec3.normalize(this.right, this.right);

    vec3.set(tempVec3, 0, 1, 0);
    vec3.transformQuat(this.up, tempVec3, tempQuat);
    vec3.normalize(this.up, this.up);

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, this.position, vec3.add(tempVec3, this.position, this.forward), this.up);
    return viewMatrix;
  }
}

const tempQuat = quat.create();
const tempVec3 = vec3.create();