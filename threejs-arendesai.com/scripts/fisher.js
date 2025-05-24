import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createWebsiteOverlay } from "./windowOpen.js";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { showEgg, updateEggs } from './easterEgg.js';
import { showWebsiteIframe } from "./windowOpen.js";
import { fps } from "./main.js";

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

// Track window closures
let windowCloseCount = 0;

// Different dialogues for when the window is closed
const postCloseDialogues = [
    "oh, you closed it already? ▸ was it not what you were looking for? ▸ let's find something else.",
];

// For repeated closures beyond our prepared dialogues
const fallbackDialogues = [
    "still searching? ▸ don't forget you can give me a URL directly... ▸ aren's website isn't that cool anyway.",
    "another page lost to the depths... ▸ shall we continue our search?",
    "the tides shift, and so do websites... ▸ let's keep looking.",
    "hmm, let me try fishing up something else for you... ▸ what section did you want to see?",
    "the sea is vast and full of websites... ▸ give me a URL and I can probably pull something else up.",
    "sometimes the best treasures are hidden in the deepest parts of the ocean... ▸ would you like to try again?",
    "don't worry, there are plenty more websites in the sea. ▸ what would you like to see next?"
];

export function createFisher(scene) {
    // Create a dedicated clock for animations
    clock = new THREE.Clock();
    
    const loader = new GLTFLoader();
    
    console.log('Starting to load fisher model...');
    
    // Load the fisher model
    loader.load(
        './models/fisher.glb',
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
                    action.setLoop(THREE.LoopRepeat);
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

function handleWindowClose() {
    windowCloseCount++;
    console.log(`Window closed (count: ${windowCloseCount})`);
    
    // Show appropriate dialogue based on close count
    let closeDialogue;
    if (windowCloseCount <= postCloseDialogues.length) {
        closeDialogue = postCloseDialogues[windowCloseCount - 1];
    } else {
        // For repeated closures, cycle through fallback dialogues
        const fallbackIndex = (windowCloseCount - postCloseDialogues.length - 1) % fallbackDialogues.length;
        closeDialogue = fallbackDialogues[fallbackIndex];
    }
    
    // Add a short delay before showing the dialogue
    setTimeout(() => {
        showDialogue(closeDialogue);
    }, 100); // 100ms delay
}

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
        showDialogue("oh... ▸ you probably wanted to see aren's website... ▸ but it's sunk to the bottom of the sea.");
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
        if (dialogueProgress >= 3) {
            // Create website overlay and pass the window close callback
            createWebsiteOverlay("", handleWindowClose);
        } else {
            // Reset dialogue and start new segment if needed
            // You can add new dialogue here for each dialogueProgress level
            switch (dialogueProgress) {
                case 2:
                    showDialogue("i think i can fish some of it back up... ▸ are you looking for anything in particular?");
                    break;
            }
        }
    }
}

function updateFisher(delta) {
    if (!mixer || !animationActions.length) return;
    
    const deltaTime = clock.getDelta();
    
    if (!isPaused) {
        mixer.update(deltaTime);
        
        // Track progress for the main animation (assuming first action is primary)
        const primaryAction = animationActions[0];
        if (primaryAction && primaryAction.isRunning()) {
            const currentTime = primaryAction.time;
            
            // Check if we've hit a keyframe
            checkKeyFrames(currentTime);
        }
    }
}