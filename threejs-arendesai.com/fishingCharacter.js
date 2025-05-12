// Complete implementation of the fishing character
// Save this as fishingCharacter.js

import * as THREE from 'three/webgpu';

// Function to create the fishing character
export function createFishingCharacter(scene, porch) {
    // Character group to hold all parts
    const character = new THREE.Group();
    
    // Materials
    const bodyMaterial = new THREE.MeshPhysicalMaterial({ color: 0x006400, roughness: 0.7 });
    const headMaterial = new THREE.MeshPhysicalMaterial({ color: 0x006400, roughness: 0.5 });
    const rodMaterial = new THREE.MeshPhysicalMaterial({ color: 0x8B4513, roughness: 0.9 });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    
    // Character parts
    // Head (cube)
    const headGeometry = new THREE.BoxGeometry(8, 8, 8);
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 16;
    head.name = "head"; // Named for animation targeting
    character.add(head);
    
    // Body (rectangle)
    const bodyGeometry = new THREE.BoxGeometry(10, 14, 6);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 5;
    character.add(body);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(4, 12, 4);
    
    // Left arm
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(-7, 7, 0);
    character.add(leftArm);
    
    // Right arm (will hold fishing rod)
    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(7, 7, 0);
    rightArm.rotation.z = -Math.PI / 6; // Angle arm to hold rod
    character.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(4, 14, 4);
    
    // Left leg
    const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    leftLeg.position.set(-4, -9, 0);
    character.add(leftLeg);
    
    // Right leg
    const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    rightLeg.position.set(4, -9, 0);
    character.add(rightLeg);
    
    // Fishing rod
    const rodGeometry = new THREE.CylinderGeometry(0.5, 0.5, 36, 8);
    const rod = new THREE.Mesh(rodGeometry, rodMaterial);
    rod.rotation.z = Math.PI / 4; // Angle rod for fishing
    rod.position.set(12, 14, 0);
    rod.name = "fishingRod"; // Named for animation targeting
    character.add(rod);
    
    // Fishing line
    const linePoints = [
        new THREE.Vector3(23, 26, 0), // Rod tip
        new THREE.Vector3(23, -12, 0)  // Water level
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const fishingLine = new THREE.Line(lineGeometry, lineMaterial);
    character.add(fishingLine);
    
    // Float/bobber on the fishing line
    const bobberGeometry = new THREE.SphereGeometry(1.5, 8, 8);
    const bobberMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const bobber = new THREE.Mesh(bobberGeometry, bobberMaterial);
    bobber.position.set(23, -10, 0); // Just above water level
    bobber.name = "bobber";
    character.add(bobber);
    
    // Position the character at the edge of the pier
    character.position.set(0, 3, 75); // Position at end of pier
    character.rotation.y = Math.PI; // Face toward water
    scene.add(character);
    
    // Animation mixer
    const mixer = new THREE.AnimationMixer(character);
    
    // Animation clips
    // 1. Idle animation (slight breathing movement)
    const idleKF = new THREE.KeyframeTrack(
        '.scale', // Property to animate
        [0, 1, 2], // Times
        [1, 1, 1, 1.02, 1, 1, 1, 1, 1] // Values (scale x, y, z)
    );
    const idleClip = new THREE.AnimationClip('idle', 2, [idleKF]);
    
    // Rod bobbing animation for idle state
    const rodBobKF = new THREE.KeyframeTrack(
        'fishingRod.rotation[z]', // Target the fishing rod's z rotation using its name
        [0, 0.5, 1, 1.5, 2],
        [Math.PI/4, Math.PI/4 + 0.05, Math.PI/4, Math.PI/4 - 0.05, Math.PI/4]
    );
    const rodBobClip = new THREE.AnimationClip('rodBob', 2, [rodBobKF]);
    
    // Bobber animation - make it bob up and down in the water
    const bobberKF = new THREE.KeyframeTrack(
        'bobber.position[y]', // Animate the bobber's y position
        [0, 0.5, 1, 1.5, 2], 
        [-10, -9.5, -10, -10.2, -10] // Bobbing movement
    );
    const bobberClip = new THREE.AnimationClip('bobber', 2, [bobberKF]);
    
    // 2. Looking backward animation
    const lookBackHeadKF = new THREE.KeyframeTrack(
        'head.rotation[y]', // The head's y rotation using its name
        [0, 1], 
        [0, Math.PI * 0.75] // Rotate head to look backward
    );
    const lookBackClip = new THREE.AnimationClip('lookBack', 1, [lookBackHeadKF]);
    
    // 3. Thinking while looking backward animation
    const thinkingHeadKF = new THREE.KeyframeTrack(
        'head.rotation[x]', // The head's x rotation (nodding) using its name
        [0, 0.5, 1, 1.5, 2],
        [0, 0.1, 0, -0.1, 0] // Slight nodding motion
    );
    const thinkingClip = new THREE.AnimationClip('thinking', 2, [thinkingHeadKF]);
    
    // Create animation actions
    const idleAction = mixer.clipAction(idleClip);
    const rodBobAction = mixer.clipAction(rodBobClip);
    const bobberAction = mixer.clipAction(bobberClip);
    const lookBackAction = mixer.clipAction(lookBackClip);
    const thinkingAction = mixer.clipAction(thinkingClip);
    
    // Set animation weights and start idle animations
    idleAction.setEffectiveWeight(1);
    rodBobAction.setEffectiveWeight(1);
    bobberAction.setEffectiveWeight(1);
    idleAction.play();
    rodBobAction.play();
    bobberAction.play();
    
    // State machine for character animations
    let currentState = 'idle';
    let nextStateTimeout = null;
    
    // Function to change character state
    function changeState(newState) {
        // Clear any pending state changes
        if (nextStateTimeout) {
            clearTimeout(nextStateTimeout);
        }
        
        // Handle state transitions
        switch (newState) {
            case 'idle':
                // Transition from any state to idle
                lookBackAction.stop();
                thinkingAction.stop();
                
                // Get reference to head by name
                const head = character.getObjectByName("head");
                if (head) {
                    head.rotation.y = 0;
                    head.rotation.x = 0;
                }
                
                idleAction.reset().play();
                rodBobAction.reset().play();
                bobberAction.reset().play();
                
                // Occasionally look back
                nextStateTimeout = setTimeout(() => {
                    changeState('lookingBack');
                }, 5000 + Math.random() * 10000); // Random time between 5-15 seconds
                break;
                
            case 'lookingBack':
                // Start looking back animation
                lookBackAction.reset().play();
                
                // After looking back, either go back to idle or start thinking
                nextStateTimeout = setTimeout(() => {
                    // 50% chance to think, 50% to return to idle
                    if (Math.random() > 0.5) {
                        changeState('thinking');
                    } else {
                        changeState('idle');
                    }
                }, 3000);
                break;
                
            case 'thinking':
                // Character is already looking back, now start thinking
                thinkingAction.reset().play();
                
                // Return to idle after thinking
                nextStateTimeout = setTimeout(() => {
                    changeState('idle');
                }, 4000);
                break;
        }
        
        currentState = newState;
    }
    
    // Start in idle state
    changeState('thinking');
    
    // Animation update function to be called in render loop
    function update(delta) {
        mixer.update(delta);
    }
    
    // Return the character and update function
    return {
        character,
        update
    };
}