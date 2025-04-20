export class InventoryManager {
    constructor() {
        this.ores = {};
        this.bars = {};
        
        this.oreInventoryElement = document.getElementById('oreInventory');
        this.barInventoryElement = document.getElementById('barInventory');
        
        // Initialize UI
        this.updateUI();
    }
    
    addOre(oreType, count = 1) {
        if (!this.ores[oreType]) {
            this.ores[oreType] = 0;
        }
        this.ores[oreType] += count;
        this.updateUI();
    }
    
    removeOre(oreType, count = 1) {
        if (this.ores[oreType] && this.ores[oreType] >= count) {
            this.ores[oreType] -= count;
            if (this.ores[oreType] === 0) {
                delete this.ores[oreType];
            }
            this.updateUI();
            return true;
        }
        return false;
    }
    
    addBar(barType, count = 1) {
        if (!this.bars[barType]) {
            this.bars[barType] = 0;
        }
        this.bars[barType] += count;
        this.updateUI();
    }
    
    removeBar(barType, count = 1) {
        if (this.bars[barType] && this.bars[barType] >= count) {
            this.bars[barType] -= count;
            if (this.bars[barType] === 0) {
                delete this.bars[barType];
            }
            this.updateUI();
            return true;
        }
        return false;
    }
    
    getOreCount(oreType) {
        return this.ores[oreType] || 0;
    }
    
    getBarCount(barType) {
        return this.bars[barType] || 0;
    }
    
    updateUI() {
        // Update ores display
        this.oreInventoryElement.innerHTML = '';
        for (const oreType in this.ores) {
            const oreItem = document.createElement('div');
            oreItem.className = 'inventory-item';
            oreItem.innerHTML = `<span>${oreType}</span><span>${this.ores[oreType]}</span>`;
            this.oreInventoryElement.appendChild(oreItem);
        }
        
        // Update bars display
        this.barInventoryElement.innerHTML = '';
        for (const barType in this.bars) {
            const barItem = document.createElement('div');
            barItem.className = 'inventory-item';
            barItem.innerHTML = `<span>${barType}</span><span>${this.bars[barType]}</span>`;
            this.barInventoryElement.appendChild(barItem);
        }
    }
    
    toggleVisibility() {
        const inventory = document.getElementById('inventory');
        inventory.style.display = inventory.style.display === 'none' ? 'block' : 'none';
    }
}

