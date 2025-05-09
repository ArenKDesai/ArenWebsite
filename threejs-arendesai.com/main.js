import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGPUCapabilities from 'three/addons/capabilities/WebGPU.js';

// Initialize application
async function init() {
    // Check if WebGPU is available
    if (!WebGPUCapabilities.isAvailable()) {
        showError("WebGPU is not supported in your browser. Try using Chrome or Edge with latest updates.");
        return;
    }

    // Create renderer
    const renderer = new THREE.WebGPURenderer({ 
        antialias: true,
        alpha: true
    });
    
    try {
        // Initialize WebGPU renderer
        await renderer.init();
    } catch (error) {
        showError("Failed to initialize WebGPU: " + error.message);
        return;
    }
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(renderer.domElement);
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111133);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.z = 5;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);
    
    // Add a basic mesh
    const geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x00aaff,
        roughness: 0.3,
        metalness: 0.7
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.005;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Display error message
function showError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    
    // Fallback to simple message if container doesn't exist
    if (!errorContainer) {
        alert(message);
    }
}

// Start the application
init();
