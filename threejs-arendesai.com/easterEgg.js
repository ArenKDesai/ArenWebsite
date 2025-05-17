import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { world_scene } from "./main.js";

let eggs = [];
const EGG_SPACING = 1; // Space between eggs

export function showEgg() {
    const loader = new GLTFLoader();
    const scene = world_scene;
    loader.load(
        "easterEgg.glb",
        (gltf) => {
            // Scale the egg model down if needed
            gltf.scene.scale.set(0.25, 0.25, 0.25);
            
            // Create a container for the egg
            const eggContainer = new THREE.Group();
            eggContainer.add(gltf.scene);
            
            // Add to eggs array and scene
            eggs.push(eggContainer);
            scene.add(eggContainer);
            
            // Position the egg at the bottom of the screen
            // Calculate position based on number of eggs
            const index = eggs.length - 1;
            
            // Create a bounding box to get the size
            const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
            const eggWidth = boundingBox.max.x - boundingBox.min.x;
            
            // Position in world space
            // camera.position.x = -29.187;
            // camera.position.y = 1.882;
            // camera.position.z = 27.907;

            const startX = -(eggs.length - 1) * EGG_SPACING / 2; // Center the row
            eggContainer.position.set(
                startX + index * EGG_SPACING, 
                1.882,
                20.907
            );
            
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
            
            // Create a position for the whole egg list
            // Recalculate positions for all eggs to keep them centered as a group
            repositionEggs();
        },
        undefined,
        (error) => {
            console.error('Error loading Easter egg model:', error);
        }
    );
}

// Helper function to reposition all eggs when a new one is added
function repositionEggs() {
    const totalWidth = (eggs.length - 1) * EGG_SPACING;
    const startX = -totalWidth / 2 - 40; // Center the entire row
    
    eggs.forEach((egg, index) => {
        egg.position.x = startX + index * EGG_SPACING;
    });
}

// Add this function to animate all eggs
export function updateEggs(time) {
    eggs.forEach(egg => {
        if (egg.userData && egg.userData.update) {
            egg.userData.update(time);
        }
    });
}