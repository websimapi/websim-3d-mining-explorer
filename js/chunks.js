import * as THREE from 'three';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';
import { OreMaterials, OreTypes } from './ores.js';

export class ChunkManager {
    constructor(scene) {
        this.scene = scene;
        this.chunks = new Map();
        this.chunkSize = 16;
        this.renderDistance = 3;
        this.maxHeight = 5;
        
        // Create noise generators
        this.terrainNoise = new SimplexNoise();
        this.oreNoise = new SimplexNoise();
        
        // Create the ground plane
        this.createGroundPlane();
    }
    
    createGroundPlane() {
        const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
        const planeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513, // Brown color for soil
            roughness: 0.8
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = 0;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }
    
    getChunkKey(x, z) {
        return `${Math.floor(x / this.chunkSize)},${Math.floor(z / this.chunkSize)}`;
    }
    
    update(playerPosition) {
        const playerChunkX = Math.floor(playerPosition.x / this.chunkSize);
        const playerChunkZ = Math.floor(playerPosition.z / this.chunkSize);
        
        // Generate or load chunks within render distance
        for (let x = playerChunkX - this.renderDistance; x <= playerChunkX + this.renderDistance; x++) {
            for (let z = playerChunkZ - this.renderDistance; z <= playerChunkZ + this.renderDistance; z++) {
                const chunkKey = `${x},${z}`;
                
                if (!this.chunks.has(chunkKey)) {
                    this.generateChunk(x, z);
                }
            }
        }
        
        // Unload chunks outside render distance
        this.chunks.forEach((chunk, key) => {
            const [chunkX, chunkZ] = key.split(',').map(Number);
            
            if (Math.abs(chunkX - playerChunkX) > this.renderDistance || 
                Math.abs(chunkZ - playerChunkZ) > this.renderDistance) {
                this.unloadChunk(key);
            }
        });
    }
    
    generateChunk(chunkX, chunkZ) {
        const chunkGroup = new THREE.Group();
        const chunkKey = `${chunkX},${chunkZ}`;
        
        // Determine ore distributions based on a secondary noise function
        const chunkOres = this.determineChunkOres(chunkX, chunkZ);
        
        // Generate blocks within chunk
        for (let x = 0; x < this.chunkSize; x++) {
            for (let z = 0; z < this.chunkSize; z++) {
                const worldX = chunkX * this.chunkSize + x;
                const worldZ = chunkZ * this.chunkSize + z;
                
                // Use noise to determine if we should place an ore
                const oreType = this.getOreAtPosition(worldX, worldZ, chunkOres);
                
                if (oreType) {
                    const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
                    const blockMaterial = OreMaterials[oreType];
                    const block = new THREE.Mesh(blockGeometry, blockMaterial);
                    
                    block.position.set(worldX, 0.5, worldZ);
                    block.userData = {
                        isBlock: true,
                        oreType: oreType
                    };
                    
                    block.castShadow = true;
                    block.receiveShadow = true;
                    
                    chunkGroup.add(block);
                }
            }
        }
        
        this.scene.add(chunkGroup);
        this.chunks.set(chunkKey, chunkGroup);
    }
    
    determineChunkOres(chunkX, chunkZ) {
        // Generate random ore veins for this chunk
        const ores = {};
        const worldSeed = chunkX * 10000 + chunkZ;
        
        // Probability of each ore type (adjusted for rarity)
        const commonOres = [OreTypes.HEMATITE, OreTypes.CHALCOPYRITE, OreTypes.BAUXITE];
        const uncommonOres = [OreTypes.GALENA, OreTypes.SPHALERITE, OreTypes.CASSITERITE];
        const rareOres = [OreTypes.NATIVE_GOLD, OreTypes.ARGENTITE, OreTypes.URANINITE];
        
        // Add 1-3 common ore veins
        const commonVeins = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < commonVeins; i++) {
            const oreType = commonOres[Math.floor(Math.random() * commonOres.length)];
            const veinSize = Math.floor(Math.random() * 10) + 5; // 5-15 blocks
            ores[oreType] = {
                centerX: Math.random() * this.chunkSize,
                centerZ: Math.random() * this.chunkSize,
                radius: veinSize / 3
            };
        }
        
        // Add 0-2 uncommon ore veins
        if (Math.random() < 0.7) {
            const uncommonVeins = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < uncommonVeins; i++) {
                const oreType = uncommonOres[Math.floor(Math.random() * uncommonOres.length)];
                const veinSize = Math.floor(Math.random() * 5) + 3; // 3-8 blocks
                ores[oreType] = {
                    centerX: Math.random() * this.chunkSize,
                    centerZ: Math.random() * this.chunkSize,
                    radius: veinSize / 3
                };
            }
        }
        
        // Add 0-1 rare ore veins (10% chance)
        if (Math.random() < 0.1) {
            const oreType = rareOres[Math.floor(Math.random() * rareOres.length)];
            const veinSize = Math.floor(Math.random() * 3) + 1; // 1-4 blocks
            ores[oreType] = {
                centerX: Math.random() * this.chunkSize,
                centerZ: Math.random() * this.chunkSize,
                radius: veinSize / 3
            };
        }
        
        return ores;
    }
    
    getOreAtPosition(worldX, worldZ, chunkOres) {
        // Check if position is within any ore vein
        for (const [oreType, vein] of Object.entries(chunkOres)) {
            const chunkX = worldX % this.chunkSize;
            const chunkZ = worldZ % this.chunkSize;
            
            const dx = chunkX - vein.centerX;
            const dz = chunkZ - vein.centerZ;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            // Add some noise to the vein shape
            const noiseValue = this.oreNoise.noise(worldX * 0.2, worldZ * 0.2);
            const adjustedRadius = vein.radius * (1 + noiseValue * 0.5);
            
            if (distance < adjustedRadius) {
                // Probability decreases with distance from center
                const probability = 1 - (distance / adjustedRadius);
                if (Math.random() < probability) {
                    return oreType;
                }
            }
        }
        
        return null;
    }
    
    unloadChunk(chunkKey) {
        const chunk = this.chunks.get(chunkKey);
        if (chunk) {
            this.scene.remove(chunk);
            this.chunks.delete(chunkKey);
        }
    }
}

