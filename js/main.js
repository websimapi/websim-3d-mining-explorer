import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OreMaterials, BarMaterials, OreTypes, oreInfo } from './ores.js';
import { ChunkManager } from './chunks.js';
import { Player } from './player.js';
import { InventoryManager } from './inventory.js';

// Initialize the game
class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87ceeb); // Sky blue color
        
        // Setup lighting
        this.setupLighting();
        
        // Initialize controls
        this.controls = new PointerLockControls(this.camera, document.body);
        this.setupEventListeners();
        
        // Initialize player, chunks, and inventory
        this.player = new Player(this.camera, this.controls);
        this.chunkManager = new ChunkManager(this.scene);
        this.inventory = new InventoryManager();
        
        // Mining properties
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.isMouseDown = false;
        this.miningTime = 0;
        this.miningTarget = null;
        this.miningDuration = 1000; // 1 second to mine a block
        
        // UI elements
        this.blockInfoElement = document.getElementById('blockInfo');
        this.positionInfoElement = document.getElementById('positionInfo');
        this.miningProgressElement = document.getElementById('miningProgress');
        
        // Game state
        this.gameActive = false;
        this.smeltingOpen = false;
        
        // Start the game loop
        this.animate();
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(100, 100, 100);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }
    
    setupEventListeners() {
        // Game container for pointer lock
        const gameContainer = document.getElementById('gameContainer');
        const instructions = document.getElementById('instructions');
        
        // Start game on click
        instructions.addEventListener('click', () => {
            this.controls.lock();
        });
        
        // Handle pointer lock events
        this.controls.addEventListener('lock', () => {
            instructions.style.display = 'none';
            this.gameActive = true;
        });
        
        this.controls.addEventListener('unlock', () => {
            instructions.style.display = 'block';
            this.gameActive = false;
        });
        
        // Mouse events for mining
        document.addEventListener('mousedown', () => {
            if (this.gameActive && !this.smeltingOpen) {
                this.isMouseDown = true;
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
            this.miningTime = 0;
            this.miningTarget = null;
            this.miningProgressElement.innerText = '';
        });
        
        // Keyboard events
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Smelting UI
        document.getElementById('smeltButton').addEventListener('click', () => this.toggleSmelting());
        document.getElementById('closeSmeltingButton').addEventListener('click', () => this.toggleSmelting());
    }
    
    handleKeyDown(event) {
        if (!this.gameActive) return;
        
        switch(event.code) {
            case 'KeyW':
            case 'KeyA':
            case 'KeyS':
            case 'KeyD':
            case 'KeyE': // Jump
                this.player.handleKeyDown(event.code);
                break;
            case 'KeyQ': // Toggle inventory
                this.inventory.toggleVisibility();
                break;
            case 'KeyF': // Smelting menu
                this.toggleSmelting();
                break;
        }
    }
    
    handleKeyUp(event) {
        if (!this.gameActive) return;
        
        switch(event.code) {
            case 'KeyW':
            case 'KeyA':
            case 'KeyS':
            case 'KeyD':
            case 'KeyE':
                this.player.handleKeyUp(event.code);
                break;
        }
    }
    
    toggleSmelting() {
        const smeltingMenu = document.getElementById('smeltingMenu');
        this.smeltingOpen = !this.smeltingOpen;
        
        if (this.smeltingOpen) {
            smeltingMenu.style.display = 'block';
            this.updateSmeltingMenu();
        } else {
            smeltingMenu.style.display = 'none';
        }
    }
    
    updateSmeltingMenu() {
        const smeltingOptions = document.getElementById('smeltingOptions');
        smeltingOptions.innerHTML = '';
        
        // Create smelting options for each ore type
        for (const oreType in oreInfo) {
            const info = oreInfo[oreType];
            const oreCount = this.inventory.getOreCount(oreType);
            
            if (info.smeltsInto && oreCount > 0) {
                const smeltButton = document.createElement('button');
                smeltButton.className = 'smelt-button';
                smeltButton.innerHTML = `Smelt ${oreType} to ${info.smeltsInto} (${oreCount} available)`;
                smeltButton.addEventListener('click', () => this.smeltOre(oreType));
                smeltingOptions.appendChild(smeltButton);
            }
        }
    }
    
    smeltOre(oreType) {
        const info = oreInfo[oreType];
        if (info.smeltsInto && this.inventory.getOreCount(oreType) > 0) {
            this.inventory.removeOre(oreType, 1);
            this.inventory.addBar(info.smeltsInto, 1);
            this.updateSmeltingMenu();
        }
    }
    
    updateMining(deltaTime) {
        if (!this.isMouseDown || !this.gameActive) return;
        
        // Cast ray from camera center
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const intersect = intersects[0];
            
            // Only mine blocks, not the ground plane
            if (intersect.object.userData.isBlock && intersect.distance < 5) {
                if (this.miningTarget !== intersect.object) {
                    this.miningTarget = intersect.object;
                    this.miningTime = 0;
                }
                
                this.miningTime += deltaTime;
                const progress = Math.min(this.miningTime / this.miningDuration, 1);
                this.miningProgressElement.innerText = `Mining: ${Math.round(progress * 100)}%`;
                
                if (this.miningTime >= this.miningDuration) {
                    this.mineBlock(this.miningTarget);
                    this.miningTime = 0;
                    this.miningTarget = null;
                    this.miningProgressElement.innerText = '';
                }
                
                this.blockInfoElement.innerText = intersect.object.userData.oreType || 'Stone';
            } else {
                this.miningTarget = null;
                this.miningTime = 0;
                this.miningProgressElement.innerText = '';
                this.blockInfoElement.innerText = 'None';
            }
        } else {
            this.miningTarget = null;
            this.miningTime = 0;
            this.miningProgressElement.innerText = '';
            this.blockInfoElement.innerText = 'None';
        }
    }
    
    mineBlock(block) {
        if (!block) return;
        
        // Add the mined ore to inventory
        if (block.userData.oreType) {
            this.inventory.addOre(block.userData.oreType, 1);
        }
        
        // Remove the block from the scene
        this.scene.remove(block);
    }
    
    update(deltaTime) {
        this.player.update(deltaTime);
        
        // Update chunks based on player position
        this.chunkManager.update(this.player.position);
        
        // Update mining
        this.updateMining(deltaTime);
        
        // Update position display
        const position = this.player.position;
        this.positionInfoElement.innerText = `${Math.round(position.x)}, ${Math.round(position.y)}, ${Math.round(position.z)}`;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = 16; // Approximate 60fps
        
        if (this.gameActive) {
            this.update(deltaTime);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});

