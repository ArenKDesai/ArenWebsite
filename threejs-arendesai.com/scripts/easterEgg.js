import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { world_scene } from "./main.js";

let eggs = [];
let numEggs = 0;
const MAX_EGGS = 2;

function showEgg() {
    if (numEggs == MAX_EGGS) {
        return;
    }
    const loader = new GLTFLoader();
    const scene = world_scene;
    loader.load(
        "../models/easterEgg.glb",
        (gltf) => {
            // Scale the egg model down if needed
            gltf.scene.scale.set(0.25, 0.25, 0.25);
            
            // Create a container for the egg
            const eggContainer = new THREE.Group();
            eggContainer.add(gltf.scene);

            switch(numEggs) {
                case 0:
                    eggContainer.position.set(-30, -2, 18);
                case 1:
                    eggContainer.position.set(-32, -2, 17);
            }
            
            // Add to eggs array and scene
            eggs.push(eggContainer);
            scene.add(eggContainer);
            
            // Add a small rotation animation
            const randomSpeed = 0.5 + Math.random() * 0.5;
            
            // Store the initial creation time for animation
            eggContainer.userData = {
                creationTime: Date.now(),
                rotationSpeed: randomSpeed
            };
            
            // Update function for this egg's animation
            eggContainer.userData.update = (time) => {
                // Slow rotation
                eggContainer.rotation.y = time * eggContainer.userData.rotationSpeed;
            };

            numEggs++;
        },
        undefined,
        (error) => {
            console.error('Error loading Easter egg model:', error);
        }
    );
}

// Add this function to animate all eggs
function updateEggs(time) {
    eggs.forEach(egg => {
        if (egg.userData && egg.userData.update) {
            egg.userData.update(time);
        }
    });
}

export { updateEggs, showEgg, MAX_EGGS, numEggs };
