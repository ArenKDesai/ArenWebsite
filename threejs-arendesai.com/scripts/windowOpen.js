// windowOpen.js - Simplified with proper state checking
import { findMostSimilarUrl } from "./similarityAlgo.js";
import { showEgg } from "./easterEgg.js";
import { world_scene } from "./main.js";
import { fisherStateMachine } from "./fisherStateMachine.js";

const urlDict = {
    "table of contents. all projects. work.": "https://arenkdesai.github.io/ArenWebsite",
    "portfolio. resume. cv.": "https://arenkdesai.github.io/ArenWebsite/portfolio",
    "boat. graphics. sea. water. fish.": "https://arenkdesai.github.io/ArenWebsite/boat",
    "coursework. school. classes.": "https://arenkdesai.github.io/ArenWebsite/coursework",
    "point sprites. graphics. particles.": "https://arenkdesai.github.io/ArenWebsite/pointspritetutorial",
    "robotics. hardware. can vesc. wroversoftware.": "https://arenkdesai.github.io/ArenWebsite/wroversoftware",
    "gcp. google clould platform. cloud. website.": "https://arenkdesai.github.io/ArenWebsite/gcpwebsite",
    "market simulation optimizer. optimization. miso. madison gas & electric. madison gas and electric. mge.": "https://arenkdesai.github.io/ArenWebsite/marketsimoptimizer",
    "madison gas and electric. madison gas & electric. mge. lmp. locational market price. machine learning. forecasting. temporal fusion transformer.": "https://arenkdesai.github.io/ArenWebsite/lmpforecasting"
};

let onWindowClosedCallback = null;
let foundURLegg = false;
let foundReasonEgg = false;
let curURL = "";

export function createWebsiteOverlay(defaultUrl, onClosed) {
    // Only show if state machine allows it
    if (!fisherStateMachine.canShowInput()) {
        console.log("Input dialog blocked - wrong animation state");
        return;
    }

    // Prevent duplicates
    if (document.getElementById('url-input-dialog') || document.getElementById('popup-site')) {
        return;
    }

    if (onClosed && typeof onClosed === 'function') {
        onWindowClosedCallback = onClosed;
    }

    const inputDialog = document.createElement('div');
    inputDialog.id = 'url-input-dialog';
    inputDialog.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(180, 170, 160, 0.9);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        min-width: 300px;
        max-width: 400px;
    `;

    const form = document.createElement('form');
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = defaultUrl || '';
    input.placeholder = "show me aren's table of contents";
    input.style.cssText = `
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
        background-color: rgba(220, 210, 200, 1.0);
    `;

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Open';
    submitBtn.type = 'submit';
    submitBtn.style.cssText = `
        padding: 6px 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        float: right;
    `;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userRes = input.value.trim();
        let showWebsite;
        
        if (userRes.slice(0,8) === "https://" || userRes.slice(0,7) === "http://" || 
            userRes.slice(0,4) === "www." || userRes.includes(".com")) {
            if (!foundURLegg && userRes.includes("arendesai.com")) {
                foundURLegg = true;
                showEgg(world_scene);
            }
            else if (!foundReasonEgg && userRes.toLowerCase().includes("find what you love and let it kill you")) {
                foundReasonEgg = true;
                showEgg(world_scene);
                userRes = "https://arenkdesai.github.io/ArenWebsite/threejsreason"
            }
            showWebsite = userRes;
        } else {
            const finalUrl = findMostSimilarUrl(userRes, Object.keys(urlDict));
            showWebsite = urlDict[finalUrl];
        }
        
        if (inputDialog.parentNode) {
            document.body.removeChild(inputDialog);
        }

        curURL = showWebsite;
        fisherStateMachine.onInputSubmitted();
    });

    const escapeHandler = (e) => {
        if (e.key === 'Escape' && inputDialog.parentNode) {
            document.body.removeChild(inputDialog);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    form.appendChild(input);
    form.appendChild(submitBtn);
    inputDialog.appendChild(form);
    document.body.appendChild(inputDialog);
    
    setTimeout(() => input.focus(), 10);
}

export function showWebsiteIframe() {
    // Only show if state machine allows it
    if (!fisherStateMachine.canShowWebsite()) {
        console.log("Website iframe blocked - wrong animation state");
        return;
    }

    if (document.getElementById('website-overlay')) {
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'website-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 20%;
        left: 10%;
        width: 40%;
        height: 60%;
        z-index: 1000;
        background-color: rgba(180, 170, 160, 0.8);
        border-radius: 4px;
        overflow: hidden;
    `;

    const iframe = document.createElement('iframe');
    iframe.src = curURL;
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
    `;
    iframe.id = 'popup-site';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 6px;
        right: 20px;
        width: 24px;
        height: 24px;
        border-radius: 10%;
        background-color: #f1f1f1;
        border: none;
        font-size: 18px;
        line-height: 20px;
        cursor: pointer;
        z-index: 1001;
    `;

    const closeWebsite = () => {
        if (overlay.parentNode) {
            document.body.removeChild(overlay);
            if (onWindowClosedCallback) {
                onWindowClosedCallback();
            }
        }
    };

    closeBtn.addEventListener('click', closeWebsite);

    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeWebsite();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    overlay.appendChild(iframe);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
}
