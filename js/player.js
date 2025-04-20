import * as THREE from 'three';

export class Player {
    constructor(camera, controls) {
        this.camera = camera;
        this.controls = controls;
        this.position = new THREE.Vector3(0, 2, 0);
        this.velocity = new THREE.Vector3();
        this.moveSpeed = 0.1;
        this.jumpStrength = 0.2;
        this.gravity = 0.01;
        this.onGround = false;
        
        // Initialize camera position
        this.camera.position.copy(this.position);
        
        // Movement state
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;
    }
    
    handleKeyDown(code) {
        switch (code) {
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'KeyD':
                this.moveRight = true;
                break;
            case 'KeyE':
                if (this.onGround) {
                    this.velocity.y = this.jumpStrength;
                    this.onGround = false;
                }
                break;
        }
    }
    
    handleKeyUp(code) {
        switch (code) {
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'KeyD':
                this.moveRight = false;
                break;
        }
    }
    
    update(deltaTime) {
        // Apply gravity
        this.velocity.y -= this.gravity;
        
        // Check ground collision and apply movement
        if (this.position.y <= 2) {
            this.position.y = 2;
            this.velocity.y = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
        
        // Calculate forward and right vectors from camera
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        forward.y = 0;
        forward.normalize();
        
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
        right.y = 0;
        right.normalize();
        
        // Apply movement based on keys
        const moveVector = new THREE.Vector3(0, 0, 0);
        
        if (this.moveForward) moveVector.add(forward);
        if (this.moveBackward) moveVector.sub(forward);
        if (this.moveRight) moveVector.add(right);
        if (this.moveLeft) moveVector.sub(right);
        
        if (moveVector.length() > 0) {
            moveVector.normalize().multiplyScalar(this.moveSpeed);
        }
        
        // Update position
        this.position.x += moveVector.x;
        this.position.z += moveVector.z;
        this.position.y += this.velocity.y;
        
        // Update camera position
        this.camera.position.copy(this.position);
    }
}

