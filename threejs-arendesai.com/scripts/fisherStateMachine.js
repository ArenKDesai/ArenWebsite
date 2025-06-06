// fisherStateMachine.js - Centralized animation state management
import { animationActions } from "./fisher.js";
import { showWebsiteIframe } from "./windowOpen.js";

// Animation states
export const ANIMATION_STATES = {
    IDLE: 'idle',
    DIALOGUE_INTRO: 'dialogue_intro',
    WAITING_FOR_INPUT: 'waiting_for_input',
    FISHING: 'fishing',
    CASTING: 'casting',
    WEBSITE_SHOWN: 'website_shown',
    DIALOGUE_CLOSE: 'dialogue_close'
};

// State machine
class FisherStateMachine {
    constructor() {
        this.currentState = ANIMATION_STATES.IDLE;
        this.isPaused = false;
        this.submittedRequest = false;
        this.keyFrames = [
            { time: 1.2, name: "cast_start", state: ANIMATION_STATES.CASTING },
            { time: 3.94, name: "cast_peak", state: ANIMATION_STATES.FISHING }
        ];
        this.currentKeyFrameIndex = 0;
        this.callbacks = new Map();
        
        // Bind methods
        this.checkKeyFrames = this.checkKeyFrames.bind(this);
        this.setState = this.setState.bind(this);
        this.canShowInput = this.canShowInput.bind(this);
        this.canShowWebsite = this.canShowWebsite.bind(this);
    }

    setState(newState) {
        console.log(`State transition: ${this.currentState} -> ${newState}`);
        this.currentState = newState;
        
        // Execute state-specific logic
        switch(newState) {
            case ANIMATION_STATES.CASTING:
                console.log("Fisher starts casting");
                break;
            case ANIMATION_STATES.FISHING:
                console.log("Cast reaches peak, time to fish");
                // Only show website if we're in the right flow
                if (this.canShowWebsite()) {
                    showWebsiteIframe();
                    this.setState(ANIMATION_STATES.WEBSITE_SHOWN);
                }
                break;
            case ANIMATION_STATES.WEBSITE_SHOWN:
                break;
            case ANIMATION_STATES.DIALOGUE_CLOSE:
                // Reset for next cycle
                this.resetAnimation();
                break;
        }
    }

    canShowInput() {
        return this.currentState === ANIMATION_STATES.WAITING_FOR_INPUT && !this.submittedRequest;
    }

    canShowWebsite() {
        return this.currentState === ANIMATION_STATES.FISHING;
    }

    startAnimation() {
        if (!animationActions || animationActions.length === 0) {
            console.warn('Cannot start animation - not properly initialized');
            return false;
        }

        // Reset and start animations
        animationActions.forEach(action => {
            action.reset();
            action.play();
            action.paused = false;
        });

        this.isPaused = false;
        this.currentKeyFrameIndex = 0;
        this.setState(ANIMATION_STATES.DIALOGUE_INTRO);
        return true;
    }

    pauseAnimation() {
        this.isPaused = true;
        animationActions.forEach(action => {
            action.paused = true;
        });
        console.log("Animation paused");
    }

    resumeAnimation() {
        if (this.currentState === ANIMATION_STATES.WAITING_FOR_INPUT) {
            this.isPaused = false;
            animationActions.forEach(action => {
                action.paused = false;
            });
            console.log("Animation resumed");
        }
    }

    resetAnimation() {
        this.currentKeyFrameIndex = 0;
        this.keyFrames.forEach(kf => kf.triggered = false);
        this.setState(ANIMATION_STATES.IDLE);
    }

    checkKeyFrames(currentTime) {
        if (this.isPaused) return;

        // Look for keyframes we should trigger
        for (let i = this.currentKeyFrameIndex; i < this.keyFrames.length; i++) {
            const keyFrame = this.keyFrames[i];
            
            if (currentTime >= keyFrame.time && !keyFrame.triggered) {
                keyFrame.triggered = true;
                this.currentKeyFrameIndex = i + 1;
                
                // Transition to the keyframe's state
                this.setState(keyFrame.state);
                
                // Pause at fishing point to wait for user input
                if (keyFrame.state === ANIMATION_STATES.CASTING) {
                    this.pauseAnimation();
                    // this.setState(ANIMATION_STATES.WAITING_FOR_INPUT)
                }
            }
        }
    }

    onWebsiteClosed() {
        console.log("Website closed, continuing animation");
        this.setState(ANIMATION_STATES.DIALOGUE_CLOSE);
    }

    onInputSubmitted() {
        console.log("Input submitted, resuming to fishing");
        this.resumeAnimation();
    }
}

// Export singleton instance
export const fisherStateMachine = new FisherStateMachine();

// Backward compatibility exports
export const isPaused = () => fisherStateMachine.isPaused;
export const checkKeyFrames = fisherStateMachine.checkKeyFrames;
export const resumeAnimation = fisherStateMachine.resumeAnimation;
