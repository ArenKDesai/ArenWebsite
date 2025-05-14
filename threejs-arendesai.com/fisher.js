import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createWebsiteOverlay } from "./windowOpen.js";

let mixer; // Animation mixer
let animationActions = []; // Array to hold all animation actions
let dialogueProgress = 0; // Track animation state
let fisher; // Reference to the model
let clock; // Clock for animations

export function createFisher(scene) {
    // Create a dedicated clock for animations
    clock = new THREE.Clock();
    
    const loader = new GLTFLoader();
    
    console.log('Starting to load fisher model...');
    
    // Load the fisher model
    loader.load(
        'fisher.glb',
        (gltf) => {
            fisher = gltf.scene;
            
            // Position the fisher on the pier
            fisher.position.set(-30, -2, 15); // Adjust position as needed
            fisher.scale.set(1, 1, 1); // Adjust scale if needed
            fisher.rotation.set(0, Math.PI - 0.2, 0);

            fisher.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            // Add the model to the scene
            scene.add(fisher);
            
            console.log('Fisher model loaded successfully');
            console.log('Animations available:', gltf.animations.length);
            
            // Check if the model has animations
            if (gltf.animations && gltf.animations.length > 0) {
                // Create an animation mixer
                mixer = new THREE.AnimationMixer(fisher);
                
                // Create and store animation actions for all animations
                gltf.animations.forEach((clip, index) => {
                    const action = mixer.clipAction(clip);
                    
                    // Configure each animation action
                    action.setLoop(THREE.LoopOnce);
                    action.clampWhenFinished = true;
                    action.timeScale = 1.0;
                    
                    // Store the action
                    animationActions.push(action);
                    
                    console.log(`Animation ${index}: "${clip.name}" (duration: ${clip.duration}s)`);
                });
                
                console.log(`Set up ${animationActions.length} animations`);
            } else {
                console.warn('Fisher model loaded but has no animations');
            }
            
            // Remove any existing click listeners to avoid duplicates
            document.removeEventListener('click', handleClick);
            
            // Set up click event listener on the document
            document.addEventListener('click', handleClick);
            console.log('Click event listener attached');
        },
        (xhr) => {
            console.log(`Fisher model: ${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
            console.error('An error occurred loading the fisher model:', error);
        }
    );
    
    // Return the update function that should be called in the animation loop
    return updateFisher;
}

// Handle click event
function handleClick() {
    // console.log('Document clicked!');
    // console.log('Animation state:', dialogueProgress);
    
    if (!mixer || animationActions.length === 0) {
        console.warn('Cannot play animations - not properly initialized');
        return;
    }
    
    // Toggle animations
    if (dialogueProgress > 0) {
        dialogueProgress += 1;
        
        if (dialogueProgress == 5) {
            createWebsiteOverlay("https://arenkdesai.github.io/ArenWebsite/");
        }
    } else {
        // console.log('Playing all animations');
        
        // Reset the clock
        clock.start();
        
        // Reset and play all animations
        animationActions.forEach(action => {
            action.reset();
            action.play();
        });
        
        dialogueProgress += 1;
    }
}

// Update function to be called in the animation loop
function updateFisher(delta) {
    // Check if animations are playing
    if (mixer) {
        // Use our dedicated clock for more accurate animation timing
        const deltaTime = clock.getDelta();
        
        // Update the animation mixer
        mixer.update(deltaTime);
        
        // Debug animation progress (if playing)
        if (dialogueProgress > 0) {
            // console.log('Animation time:', mixer.time.toFixed(3));
            
            // Check if all animations have completed
            const allFinished = animationActions.every(
                action => mixer.time >= action._clip.duration
            );
            
            if (allFinished) {
                // console.log('All animations complete');
                // Uncomment to auto-reset when done
                // dialogueProgress = false;
            }
        }
    }
}