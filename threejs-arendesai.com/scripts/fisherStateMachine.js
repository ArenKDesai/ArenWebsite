import { animationActions, continuousFrame } from "./fisher.js";
import { showWebsiteIframe } from "./windowOpen.js";

// wait for click
// while true:
//     begin animation until frame 30
//     wait for user to submit link text
//     play frames 31-100
//     wait for user to close window
//     play frames 101-145, end animation

let keyFrames = [
        { time: 1.2, name: "cast_start", callback: onCastStart, pauseAt: true },
        { time: 3.93, name: "cast_peak", callback: onCastPeak, pauseAt: true},
        { time: 10.0, name: "dialogue_trigger", callback: onDialogueTrigger }
    ];
let currentKeyFrameIndex = 0;
export let isPaused = false;
let animationCallbacks = new Map(); // Store callbacks for specific time

// Check if we've reached any keyframes
export function checkKeyFrames(currentTime) {
    // Look ahead to check if we're approaching or have passed keyframes
    for (let i = currentKeyFrameIndex; i < keyFrames.length; i++) {
        const keyFrame = keyFrames[i];
        
        if (currentTime >= keyFrame.time && !keyFrame.triggered) {
            // keyFrame.triggered = true;
            currentKeyFrameIndex = i + 1;
            if (currentKeyFrameIndex == keyFrames.length)
                currentKeyFrameIndex = 0;
            
            // Execute callback
            if (keyFrame.callback)
                keyFrame.callback(keyFrame, currentTime);
            
            // Optionally pause at this keyframe
            if (keyFrame.pauseAt)
                pauseAnimation();
        }
    }
}

// Pause animation at current frame
function pauseAnimation() {
    isPaused = true;
    animationActions.forEach(action => {
        action.paused = true;
    });
    console.log("Animation paused at frame:", continuousFrame);
}

// Resume animation
export function resumeAnimation() {
    isPaused = false;
    animationActions.forEach(action => {
        action.paused = false;
    });
    console.log("Animation resumed");
}

// Jump to specific time in animation
function jumpToTime(targetTime) {
    animationActions.forEach(action => {
        action.time = Math.min(targetTime, action.getClip().duration);
    });
    
    // Reset keyframe tracking
    currentKeyFrameIndex = 0;
    keyFrames.forEach(kf => kf.triggered = false);
    
    // Re-trigger any keyframes we should have passed
    checkKeyFrames(targetTime);
}

// Keyframe callback examples
function onCastStart(keyFrame, time) {
    console.log("Fisher starts casting at", time);
    // You could trigger dialogue here
    // showDialogue("casting my line...");
}

function onCastPeak(keyFrame, time) {
    console.log("Cast reaches peak at", time);
    // Maybe show water splash effect
    showWebsiteIframe();
}

function onReelIn(keyFrame, time) {
    console.log("Starting to reel in at", time);
    // Could trigger website loading here
}

function onDialogueTrigger(keyFrame, time) {
    console.log("Dialogue trigger at", time);
}

// Enhanced click handler that works with animation states
function handleClickWithAnimation() {
    if (!mixer || animationActions.length === 0) {
        console.warn('Cannot play animations - not properly initialized');
        return;
    }
    
    // If paused, resume
    if (isPaused) {
        resumeAnimation();
        return;
    }
    
    // First click - start everything
    if (dialogueProgress === 0) {
        clock.start();
        initializeKeyFrames();
        
        // Start animations
        animationActions.forEach(action => {
            action.reset();
            action.play();
        });
        
        showDialogue("oh... ▸ you probably wanted to see aren's website... ▸ but it's sunk to the bottom of the sea.");
        dialogueProgress = 1;
        return;
    }
    
    // Handle dialogue progression as before...
    // (your existing dialogue handling code)
}

// Utility function to get animation progress as percentage
function getAnimationProgress() {
    if (!animationActions[0]) return 0;
    const action = animationActions[0];
    return (action.time / action.getClip().duration) * 100;
}

// Utility to check if we're at a specific frame number
function isAtFrame(frameNumber) {
    const tolerance = 0.5; // frames
    return Math.abs(continuousFrame - frameNumber) < tolerance;
}
