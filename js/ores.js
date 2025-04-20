import * as THREE from 'three';

// Ore types enum
export const OreTypes = {
    // Iron-Based Ores
    HEMATITE: 'Hematite',
    MAGNETITE: 'Magnetite',
    LIMONITE: 'Limonite',
    SIDERITE: 'Siderite',
    GOETHITE: 'Goethite',
    
    // Copper Ores
    CHALCOPYRITE: 'Chalcopyrite',
    BORNITE: 'Bornite',
    MALACHITE: 'Malachite',
    AZURITE: 'Azurite',
    CUPRITE: 'Cuprite',
    TETRAHEDRITE: 'Tetrahedrite',
    
    // Lead Ores
    GALENA: 'Galena',
    ANGLESITE: 'Anglesite',
    CERUSSITE: 'Cerussite',
    
    // Zinc Ores
    SPHALERITE: 'Sphalerite',
    SMITHSONITE: 'Smithsonite',
    HEMIMORPHITE: 'Hemimorphite',
    
    // Tin Ores
    CASSITERITE: 'Cassiterite',
    
    // Nickel Ores
    PENTLANDITE: 'Pentlandite',
    GARNIERITE: 'Garnierite',
    NICKELINE: 'Nickeline',
    
    // Aluminum Ores
    BAUXITE: 'Bauxite',
    
    // Silver Ores
    ARGENTITE: 'Argentite',
    
    // Gold Ores
    NATIVE_GOLD: 'Native Gold',
    
    // Platinum Group Ores
    SPERRYLITE: 'Sperrylite',
    
    // Chromium Ores
    CHROMITE: 'Chromite',
    
    // Uranium Ores
    URANINITE: 'Uraninite',
    
    // Titanium Ores
    RUTILE: 'Rutile',
    ILMENITE: 'Ilmenite'
};

// Bar types enum
export const BarTypes = {
    IRON: 'Iron Bar',
    COPPER: 'Copper Bar',
    LEAD: 'Lead Bar',
    ZINC: 'Zinc Bar',
    TIN: 'Tin Bar',
    NICKEL: 'Nickel Bar',
    ALUMINUM: 'Aluminum Bar',
    SILVER: 'Silver Bar',
    GOLD: 'Gold Bar',
    PLATINUM: 'Platinum Bar',
    STEEL: 'Steel Bar',
    TITANIUM: 'Titanium Bar'
};

// Ore information and relationships
export const oreInfo = {
    // Iron-Based Ores
    [OreTypes.HEMATITE]: { color: 0x8B0000, smeltsInto: BarTypes.IRON },
    [OreTypes.MAGNETITE]: { color: 0x2F4F4F, smeltsInto: BarTypes.IRON },
    [OreTypes.LIMONITE]: { color: 0xB8860B, smeltsInto: BarTypes.IRON },
    [OreTypes.SIDERITE]: { color: 0x8B4513, smeltsInto: BarTypes.IRON },
    [OreTypes.GOETHITE]: { color: 0x8B4513, smeltsInto: BarTypes.IRON },
    
    // Copper Ores
    [OreTypes.CHALCOPYRITE]: { color: 0xB87333, smeltsInto: BarTypes.COPPER },
    [OreTypes.BORNITE]: { color: 0x9370DB, smeltsInto: BarTypes.COPPER },
    [OreTypes.MALACHITE]: { color: 0x2E8B57, smeltsInto: BarTypes.COPPER },
    [OreTypes.AZURITE]: { color: 0x1E90FF, smeltsInto: BarTypes.COPPER },
    [OreTypes.CUPRITE]: { color: 0xB22222, smeltsInto: BarTypes.COPPER },
    [OreTypes.TETRAHEDRITE]: { color: 0x808080, smeltsInto: BarTypes.COPPER },
    
    // Lead Ores
    [OreTypes.GALENA]: { color: 0x708090, smeltsInto: BarTypes.LEAD },
    [OreTypes.ANGLESITE]: { color: 0xF5F5F5, smeltsInto: BarTypes.LEAD },
    [OreTypes.CERUSSITE]: { color: 0xE0E0E0, smeltsInto: BarTypes.LEAD },
    
    // Zinc Ores
    [OreTypes.SPHALERITE]: { color: 0x8B8878, smeltsInto: BarTypes.ZINC },
    [OreTypes.SMITHSONITE]: { color: 0x7FFF00, smeltsInto: BarTypes.ZINC },
    [OreTypes.HEMIMORPHITE]: { color: 0xADD8E6, smeltsInto: BarTypes.ZINC },
    
    // Tin Ores
    [OreTypes.CASSITERITE]: { color: 0x8B4513, smeltsInto: BarTypes.TIN },
    
    // Nickel Ores
    [OreTypes.PENTLANDITE]: { color: 0xEEE8AA, smeltsInto: BarTypes.NICKEL },
    [OreTypes.GARNIERITE]: { color: 0x90EE90, smeltsInto: BarTypes.NICKEL },
    [OreTypes.NICKELINE]: { color: 0xCD5C5C, smeltsInto: BarTypes.NICKEL },
    
    // Aluminum Ores
    [OreTypes.BAUXITE]: { color: 0xDEB887, smeltsInto: BarTypes.ALUMINUM },
    
    // Silver Ores
    [OreTypes.ARGENTITE]: { color: 0x696969, smeltsInto: BarTypes.SILVER },
    
    // Gold Ores
    [OreTypes.NATIVE_GOLD]: { color: 0xDAA520, smeltsInto: BarTypes.GOLD },
    
    // Platinum Group Ores
    [OreTypes.SPERRYLITE]: { color: 0xC0C0C0, smeltsInto: BarTypes.PLATINUM },
    
    // Chromium Ores
    [OreTypes.CHROMITE]: { color: 0x3D3635, smeltsInto: null },
    
    // Uranium Ores
    [OreTypes.URANINITE]: { color: 0x3D3635, smeltsInto: null },
    
    // Titanium Ores
    [OreTypes.RUTILE]: { color: 0x8B0000, smeltsInto: BarTypes.TITANIUM },
    [OreTypes.ILMENITE]: { color: 0x696969, smeltsInto: BarTypes.TITANIUM }
};

// Materials for each ore type
export const OreMaterials = {};
for (const oreType in oreInfo) {
    OreMaterials[oreType] = new THREE.MeshStandardMaterial({
        color: oreInfo[oreType].color,
        roughness: 0.7,
        metalness: 0.2
    });
}

// Materials for each bar type
export const BarMaterials = {
    [BarTypes.IRON]: new THREE.MeshStandardMaterial({ color: 0xC0C0C0, metalness: 0.8, roughness: 0.2 }),
    [BarTypes.COPPER]: new THREE.MeshStandardMaterial({ color: 0xB87333, metalness: 0.8, roughness: 0.2 }),
    [BarTypes.LEAD]: new THREE.MeshStandardMaterial({ color: 0x7A7A7A, metalness: 0.7, roughness: 0.3 }),
    [BarTypes.ZINC]: new THREE.MeshStandardMaterial({ color: 0xE0E0E0, metalness: 0.7, roughness: 0.2 }),
    [BarTypes.TIN]: new THREE.MeshStandardMaterial({ color: 0xD3D3D3, metalness: 0.6, roughness: 0.2 }),
    [BarTypes.NICKEL]: new THREE.MeshStandardMaterial({ color: 0xBFC8CA, metalness: 0.8, roughness: 0.2 }),
    [BarTypes.ALUMINUM]: new THREE.MeshStandardMaterial({ color: 0xF0F0F0, metalness: 0.6, roughness: 0.1 }),
    [BarTypes.SILVER]: new THREE.MeshStandardMaterial({ color: 0xE6E6FA, metalness: 0.9, roughness: 0.1 }),
    [BarTypes.GOLD]: new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.9, roughness: 0.1 }),
    [BarTypes.PLATINUM]: new THREE.MeshStandardMaterial({ color: 0xE5E4E2, metalness: 0.9, roughness: 0.1 }),
    [BarTypes.STEEL]: new THREE.MeshStandardMaterial({ color: 0x71797E, metalness: 0.8, roughness: 0.2 }),
    [BarTypes.TITANIUM]: new THREE.MeshStandardMaterial({ color: 0xD1D1D1, metalness: 0.7, roughness: 0.3 })
};

