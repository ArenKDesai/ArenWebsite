import * as THREE from 'three/webgpu';
import { world_scene } from "./main.js";

class Rain {
    constructor(params = {}) {
        this.opacity = params.opacity || 0.9;
        this.count = params.count || 5000;
        this.width = params.width || 100;
        this.height = params.height || 100;
        this.depth = params.depth || 100;
        this.velocity = params.velocity || 5;
        this.size = params.size || 1.0; // Added size parameter for point size

        this.group = new THREE.Group();

        // Use PointsMaterial instead of ShaderMaterial
        this.rainMat = new THREE.PointsMaterial({
            color: 0x0000ff, // Blue color for rain
            size: this.size, // Size of each rain particle
            transparent: true,
            opacity: this.opacity,
            depthWrite: false, // Don't write to the z-buffer, good for transparent effects
            depthTest: false,
            blending: THREE.AdditiveBlending // Blending for a more ethereal look
        });

        this.createRainGroup();
    }

    createRainGroup() {
        // Clear existing rain particles if remaking the rain
        while (this.group.children.length > 0) {
            this.group.remove(this.group.children[0]);
        }

        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.count * 3); // 3D rain

        // Randomly place rain particles within the defined volume
        for (let i = 0; i < this.count; i++) {
            const idx = i * 3;
            this.positions[idx] = Math.random() * this.width - this.width / 2;
            this.positions[idx + 1] = Math.random() * this.height - this.height / 2;
            this.positions[idx + 2] = Math.random() * this.depth - this.depth / 2;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.pointsSystem = new THREE.Points(this.geometry, this.rainMat);
        this.pointsSystem.frustumCulled = false;
        this.group.add(this.pointsSystem);
    }

    update() {
        let positionsAttribute = this.geometry.getAttribute('position');
        let positionsArray = positionsAttribute.array;

        for (let i = 0; i < this.count; i++) {
            const idx = i * 3;
            positionsArray[idx + 1] -= this.velocity; // Move rain down

            // If rain goes below the bottom, reset it to the top
            if (positionsArray[idx + 1] < -this.height / 2) {
                positionsArray[idx] = Math.random() * this.width - this.width / 2;
                positionsArray[idx + 1] = this.height / 2; // Reset to the top
                positionsArray[idx + 2] = Math.random() * this.depth - this.depth / 2;
            }
        }
        positionsAttribute.needsUpdate = true; // Mark attribute as needing update
    }

    getRainGroup() {
        return this.group;
    }
}

function randomWeather() {
    const forecast = Math.random();
    let weather;
    if (forecast < 1.0) { // Currently set to always rain for demonstration
        console.log("It's raining!");
        weather = new Rain();
        world_scene.add(weather.getRainGroup());
    }
    return weather;
}

export { randomWeather };
