import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createWebsiteOverlay } from "./windowOpen.js";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

let mixer; // Animation mixer
let animationActions = []; // Array to hold all animation actions
let dialogueProgress = 0; // Track animation state
let fisher; // Reference to the model
let clock; // Clock for animations

// New variables for dialogue system
let fullDialogueText = ""; // Stores the complete dialogue text
let dialogueSegments = []; // Array to store dialogue segments split by ▸
let currentSegmentIndex = 0; // Current segment being displayed
let currentCharIndex = 0; // Current character being displayed
let isTyping = false; // Whether text is currently being animated
let typingSpeed = 50; // Milliseconds between characters
let typingInterval; // Interval for typing animation

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

function createDialogueElement() {
    // Remove any existing dialogue
    const existingLabel = fisher.getObjectByName('dialogueLabel');
    if (existingLabel) fisher.remove(existingLabel);
    
    // Create dialogue element
    const dialogueDiv = document.createElement('div');
    dialogueDiv.className = 'dialogue-bubble';
    dialogueDiv.id = 'dialogue-text';
    dialogueDiv.style.padding = '10px 15px';
    dialogueDiv.style.borderRadius = '20px';
    dialogueDiv.style.border = '2px solid #333';
    dialogueDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    dialogueDiv.style.position = 'relative';
    dialogueDiv.style.maxWidth = '250px';
    dialogueDiv.style.fontSize = '24px';
    dialogueDiv.style.color = '#333';
    
    // Create pointer triangle
    const pointer = document.createElement('div');
    pointer.style.position = 'absolute';
    pointer.style.bottom = '-10px';
    pointer.style.right = '20px';
    pointer.style.width = '0';
    pointer.style.height = '0';
    pointer.style.borderLeft = '10px solid transparent';
    pointer.style.borderRight = '10px solid transparent';
    pointer.style.borderTop = '10px solid #333';
    dialogueDiv.appendChild(pointer);
    
    // Create label
    const dialogueLabel = new CSS2DObject(dialogueDiv);
    dialogueLabel.position.set(2, 7, 0); // Position above fisher's head
    dialogueLabel.name = 'dialogueLabel';
    fisher.add(dialogueLabel);
    
    return dialogueDiv;
}

function showDialogue(text) {
    // Store the full text and split into segments
    fullDialogueText = text;
    dialogueSegments = text.split('▸').map(segment => segment.trim());
    currentSegmentIndex = 0;
    
    // Create or get the dialogue element
    let dialogueDiv = document.getElementById('dialogue-text');
    if (!dialogueDiv) {
        dialogueDiv = createDialogueElement();
    }
    
    // Start the typing animation for the first segment
    startTypingAnimation(dialogueDiv);
}

function startTypingAnimation(dialogueDiv) {
    // Clear any existing animation
    clearInterval(typingInterval);
    
    // Reset character index
    currentCharIndex = 0;
    isTyping = true;
    
    // Get the current segment text
    const currentSegment = dialogueSegments[currentSegmentIndex];
    dialogueDiv.textContent = '';
    
    // Start typing animation
    typingInterval = setInterval(() => {
        if (currentCharIndex < currentSegment.length) {
            dialogueDiv.textContent += currentSegment[currentCharIndex];
            currentCharIndex++;
        } else {
            // Finished typing this segment
            clearInterval(typingInterval);
            isTyping = false;
        }
    }, typingSpeed);
}

// Handle click event
function handleClick() {
    if (!mixer || animationActions.length === 0) {
        console.warn('Cannot play animations - not properly initialized');
        return;
    }
    
    // If this is the first click, start the dialogue
    if (dialogueProgress === 0) {
        // Reset the clock and play animations
        clock.start();
        
        // Reset and play all animations
        animationActions.forEach(action => {
            action.reset();
            action.play();
        });
        
        // Start dialogue
        showDialogue("oh... ▸ you probably wanted to see aren's website... ▸ well, that's okay.");
        dialogueProgress = 1;
        return;
    }
    
    // Handle clicks during dialogue
    let dialogueDiv = document.getElementById('dialogue-text');
    
    // If text is still typing, complete it immediately
    if (isTyping) {
        clearInterval(typingInterval);
        dialogueDiv.textContent = dialogueSegments[currentSegmentIndex];
        isTyping = false;
        return;
    }
    
    // If we have more segments, show the next one
    if (currentSegmentIndex < dialogueSegments.length - 1) {
        currentSegmentIndex++;
        startTypingAnimation(dialogueDiv);
    } else {
        // We've shown all segments, advance dialogue progress
        dialogueProgress++;
        
        // If we reached the critical point, show the website
        if (dialogueProgress >= 5) {
            createWebsiteOverlay("https://arenkdesai.github.io/ArenWebsite/wroversoftware");
        } else {
            // Reset dialogue and start new segment if needed
            // You can add new dialogue here for each dialogueProgress level
            switch (dialogueProgress) {
                case 2:
                    showDialogue("i've been fishing here for days... ▸ the water is so peaceful. ▸ do you fish?");
                    break;
                case 3:
                    showDialogue("one more click... ▸ and i'll show you aren's website. ▸ ready?");
                    break;
                case 4:
                    showDialogue("here it comes!");
                    break;
            }
        }
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