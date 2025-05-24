import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGPUCapabilities from 'three/addons/capabilities/WebGPU.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { createPier } from "./pier.js";
import { createFisher } from './fisher.js';
import { showEgg, updateEggs } from './easterEgg.js';

const texLoader = new THREE.TextureLoader();
let waterSurface;
let skybox;
let updateFisher;
export let world_scene;
export let world_camera;
export let frame = 0;
export let fps = 0;

// Initialize application
async function init() {
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
    world_scene = scene;
    scene.background = new THREE.Color(0x111133);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
        50, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    world_camera = camera;
    camera.position.x = -29.187;
    camera.position.y = 1.882;
    camera.position.z = 27.907;
    camera.rotation.x = -0.047;
    camera.rotation.y = 0.587;
    camera.rotation.z = 0.026;

    // NOTE: enable for debgging purposes
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.maxPolarAngle = Math.PI * 0.75; // Allow looking down at water
    // controls.minDistance = 10.0;
    // controls.maxDistance = 500.0;
    // controls.update();
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Load skybox and environment map first, then create water
    await loadSkyboxAndWater(scene);

    // fisher
    updateFisher = createFisher(scene);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(labelRenderer.domElement);
    
    let clock = new THREE.Clock();
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();
        const delta = clock.getDelta();
        
        // Animate the water by moving the normal map
        if (waterSurface && waterSurface.material.normalMap) {
            waterSurface.material.normalMap.offset.set(time * 0.001, time * 0.0006);
        }

        if (updateFisher) {
            updateFisher(delta);
            labelRenderer.render(scene, camera); 
        }
        updateEggs(time);

        renderer.render(scene, camera);
        
        frame++;
        fps = frame / time;
    }
    
    animate();
}

// Load skybox and create water surface
async function loadSkyboxAndWater(scene) {
    // Create the environment cubemap first
    return new Promise((resolve) => {
        texLoader.load('./textures/cubemap1.png', texture => {
            texture.colorSpace = THREE.SRGBColorSpace;
            
            // We'll need to create an OffscreenCanvas to process the texture
            const createFaceTexture = (sourceX, sourceY, faceSize) => {
                const canvas = document.createElement('canvas');
                canvas.width = faceSize;
                canvas.height = faceSize;
                const ctx = canvas.getContext('2d');
                
                // Draw the correct part of the cross image for this face
                ctx.drawImage(
                    texture.image,
                    sourceX, sourceY,  // Source position
                    faceSize, faceSize, // Source dimensions
                    0, 0, // Destination position
                    faceSize, faceSize // Destination dimensions
                );
                
                const faceTexture = new THREE.CanvasTexture(canvas);
                faceTexture.colorSpace = THREE.SRGBColorSpace;
                return faceTexture;
            };
            
            // The size of each face in the cross image
            const faceSize = 512;
            
            // Create a material array for the 6 faces of the skybox
            // The order in Three.js is [+x, -x, +y, -y, +z, -z]
            const faceTextures = [
                // +X (right face)
                createFaceTexture(2*faceSize, 1*faceSize, faceSize),
                // -X (left face)
                createFaceTexture(0*faceSize, 1*faceSize, faceSize),
                // +Y (top face)
                createFaceTexture(1*faceSize, 0*faceSize, faceSize),
                // -Y (bottom face)
                createFaceTexture(1*faceSize, 2*faceSize, faceSize),
                // +Z (front face)
                createFaceTexture(1*faceSize, 1*faceSize, faceSize),
                // -Z (back face)
                createFaceTexture(3*faceSize, 1*faceSize, faceSize)
            ];
            
            // Create environment cubemap
            const envMapTextures = [];
            for (let i = 0; i < 6; i++) {
                envMapTextures.push(faceTextures[i].image);
            }
            
            const envMap = new THREE.CubeTexture(envMapTextures);
            envMap.colorSpace = THREE.SRGBColorSpace;
            envMap.needsUpdate = true;
            
            // Set the scene's environment map
            scene.environment = envMap;
            
            // Create the skybox mesh
            const skyboxMaterials = faceTextures.map(texture => 
                new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.BackSide
                })
            );
            
            const skyboxGeometry = new THREE.BoxGeometry(900, 900, 900);
            skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
            scene.add(skybox);
            
            // Now create the water with the environment map ready
            createWaterSurface(scene, envMap);

            createPier(scene);
            
            resolve();
        });
    });
}

// Create water surface
function createWaterSurface(scene, envMap) {
    texLoader.load('./textures/waternormals.jpg', (normalMap) => {
        normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
        normalMap.repeat.set(5, 5); // Repeat the texture
        
        // Create geometry for the water
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000, 100, 100);
        
        // Create WebGPU-compatible material
        const waterMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0x001e0f),
            normalMap: normalMap,
            normalScale: new THREE.Vector2(0.3, 0.3),
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.9, // Makes it somewhat transparent like water
            thickness: 1.0,    // Depth for refraction
            envMapIntensity: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.2,
            // Explicitly set the environment map (redundant with scene.environment, but can be useful)
            envMap: envMap
        });
        
        // Create mesh
        waterSurface = new THREE.Mesh(waterGeometry, waterMaterial);
        waterSurface.rotation.x = -Math.PI / 2; // Make it horizontal
        waterSurface.position.y = -5; // Position below skybox center
        scene.add(waterSurface);
    });
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