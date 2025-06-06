// fisher.js - Simplified fisher component with cleaner dialogue management
import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createWebsiteOverlay } from "./windowOpen.js";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { fisherStateMachine, ANIMATION_STATES } from './fisherStateMachine.js';
import { MAX_EGGS, eggs } from "./easterEgg.js";

let mixer;
export let animationActions = [];
let fisher;
let clock;

// Dialogue system
class DialogueManager {
    constructor() {
        this.dialogues = {
            intro: "oh... ▸ you probably wanted to see aren's website... ▸ but it has sunk to the bottom of the sea. ▸ i think i can fish it back up... ▸ but all the webpages are scattered and soggy. ▸ tell me. what would you like to see?",
            windowClosed: [
                "looks like the links are waterlogged... ▸ you'll have to rely on the keywords you find. ▸ what else do you want to see?",
                "it's a bit of a pain trying to remember those keywords, huh? ▸ i thought websites were supposed to be convenient.",
                "still searching? ▸ i could probably find other websites with a full URL... ▸ aren's website isn't that cool anyway.",
                `i've heard there's ${MAX_EGGS} easter eggs in this website... ▸ i'm not sure how to find them.`,
                "the sea is deep... ▸ i can probably catch any website. ▸ i wonder if that includes this website...",
                `so far, it looks like you've found ${eggs.length} easter eggs... ▸ is that a lot?`
            ]
        };
        
        this.currentSegmentIndex = 0;
        this.currentCharIndex = 0;
        this.isTyping = false;
        this.typingSpeed = 25;
        this.typingInterval = null;
        this.windowCloseCount = -1; // start at -1 because windowClosed starts after one close
        this.currentSegments = [];
    }

    showDialogue(dialogueKey) {
        let dialogueText;
        
        if (dialogueKey === 'windowClosed') {
            let index = this.windowCloseCount;
            if (index > this.dialogues.windowClosed.length) {
                index = 1;
                this.windowCloseCount = 1;
            }
            dialogueText = this.dialogues.windowClosed[index];
            this.windowCloseCount++;
        } else {
            dialogueText = this.dialogues[dialogueKey];
        }

        if (!dialogueText) return;

        this.currentSegments = dialogueText.split('▸').map(s => s.trim());
        this.currentSegmentIndex = 0;
        
        let dialogueDiv = document.getElementById('dialogue-text');
        if (!dialogueDiv) {
            dialogueDiv = this.createDialogueElement();
        }
        
        this.startTypingAnimation(dialogueDiv);
    }

    createDialogueElement() {
        const existingLabel = fisher.getObjectByName('dialogueLabel');
        if (existingLabel) fisher.remove(existingLabel);
        
        const dialogueDiv = document.createElement('div');
        dialogueDiv.className = 'dialogue-bubble';
        dialogueDiv.id = 'dialogue-text';
        dialogueDiv.style.cssText = `
            padding: 10px 15px;
            border-radius: 20px;
            border: 2px solid #333;
            background-color: rgba(255, 255, 255, 0.9);
            position: relative;
            max-width: 250px;
            font-size: 24px;
            color: #333;
        `;
        
        const pointer = document.createElement('div');
        pointer.style.cssText = `
            position: absolute;
            bottom: -10px;
            right: 20px;
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid #333;
        `;
        dialogueDiv.appendChild(pointer);
        
        const dialogueLabel = new CSS2DObject(dialogueDiv);
        dialogueLabel.position.set(2, 7, 0);
        dialogueLabel.name = 'dialogueLabel';
        fisher.add(dialogueLabel);
        
        return dialogueDiv;
    }

    startTypingAnimation(dialogueDiv) {
        clearInterval(this.typingInterval);
        this.currentCharIndex = 0;
        this.isTyping = true;
        
        const currentSegment = this.currentSegments[this.currentSegmentIndex];
        dialogueDiv.textContent = '';
        
        this.typingInterval = setInterval(() => {
            if (this.currentCharIndex < currentSegment.length) {
                dialogueDiv.textContent += currentSegment[this.currentCharIndex];
                this.currentCharIndex++;
            } else {
                clearInterval(this.typingInterval);
                this.isTyping = false;
            }
        }, this.typingSpeed);
    }

    handleClick() {
        const dialogueDiv = document.getElementById('dialogue-text');
        if (!dialogueDiv) return false;

        // If typing, complete current segment
        if (this.isTyping) {
            clearInterval(this.typingInterval);
            dialogueDiv.textContent = this.currentSegments[this.currentSegmentIndex];
            this.isTyping = false;
            return true;
        }

        // If more segments, show next
        if (this.currentSegmentIndex < this.currentSegments.length - 1) {
            this.currentSegmentIndex++;
            this.startTypingAnimation(dialogueDiv);
            return true;
        }

        return false; // No more dialogue to show
    }
}

const dialogueManager = new DialogueManager();

export function createFisher(scene) {
    clock = new THREE.Clock();
    const loader = new GLTFLoader();
    
    loader.load(
        './models/fisher.glb',
        (gltf) => {
            fisher = gltf.scene;
            fisher.position.set(-30, -2, 15);
            fisher.scale.set(1, 1, 1);
            fisher.rotation.set(0, Math.PI - 0.2, 0);

            fisher.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            scene.add(fisher);
            console.log('Fisher model loaded successfully');
            
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(fisher);
                
                gltf.animations.forEach((clip, index) => {
                    const action = mixer.clipAction(clip);
                    action.setLoop(THREE.LoopOnce);
                    action.clampWhenFinished = true;
                    action.timeScale = 1.0;
                    animationActions.push(action);
                });
            }
            
            document.removeEventListener('click', handleClick);
            document.addEventListener('click', handleClick);
        },
        undefined,
        (error) => console.error('Error loading fisher model:', error)
    );
    
    return updateFisher;
}

function handleClick() {
    const state = fisherStateMachine.currentState;
    
    switch(state) {
        case ANIMATION_STATES.IDLE:
            // First click - start everything
            if (fisherStateMachine.startAnimation()) {
                if (fisherStateMachine.introPlayed)
                    dialogueManager.showDialogue('windowClosed');
                else
                    dialogueManager.showDialogue('intro');
            }
            break;
            
        case ANIMATION_STATES.DIALOGUE_INTRO:
            // Handle dialogue progression
            if (!dialogueManager.handleClick()) {
                // Dialogue finished, show fishing dialogue
                dialogueManager.showDialogue('fishing');
                fisherStateMachine.setState(ANIMATION_STATES.WAITING_FOR_INPUT);
            }
            break;
            
        case ANIMATION_STATES.WAITING_FOR_INPUT:
            // Handle dialogue or show input
            if (!dialogueManager.handleClick()) {
                // Show input dialog
                createWebsiteOverlay("", handleWebsiteClosed);
                fisherStateMachine.submittedRequest = true;
            }
            break;
        case ANIMATION_STATES.CASTING:
            if (!dialogueManager.handleClick()) {
                fisherStateMachine.setState(ANIMATION_STATES.WAITING_FOR_INPUT);
                handleClick();
            }
            
        case ANIMATION_STATES.WEBSITE_SHOWN:
            // Website is open, ignore clicks
            break;
            
        case ANIMATION_STATES.DIALOGUE_CLOSE:
            // Handle post-close dialogue
            if (!dialogueManager.handleClick()) {
                fisherStateMachine.setState(ANIMATION_STATES.WAITING_FOR_INPUT);
            }
            break;
    }
}

function handleWebsiteClosed() {
    dialogueManager.showDialogue('windowClosed');
    fisherStateMachine.onWebsiteClosed();
    fisherStateMachine.setState(ANIMATION_STATES.DIALOGUE_CLOSE);
}

export let continuousFrame = 0;
function updateFisher(delta) {
    if (!mixer || !animationActions.length) return;
    
    const deltaTime = clock.getDelta();
    
    if (!fisherStateMachine.isPaused) {
        mixer.update(deltaTime);
        
        const primaryAction = animationActions[0];
        if (primaryAction && primaryAction.isRunning()) {
            fisherStateMachine.checkKeyFrames(primaryAction.time);
        }
        continuousFrame++;
    }
}

