import * as THREE from 'three/webgpu';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const loader = new OBJLoader();
const texLoader = new THREE.TextureLoader();

export function createPier(scene) {
    // Use the same environment map that's applied to the scene
    const envMap = scene.environment;
    
    loader.load(
        "pier.obj",
        (object) => {
            const woodTex = texLoader.load("woodTex.jpeg");
            woodTex.colorSpace = THREE.SRGBColorSpace;
            
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    // Create a more physically accurate wood material
                    child.material = new THREE.MeshPhysicalMaterial({
                        map: woodTex,
                        color: 0xffffff,
                        envMap: envMap,                    // Use the scene's environment map
                        envMapIntensity: 0.5,              // Control environment reflection strength
                        roughness: 0.65,                   // Wood is somewhat rough
                        metalness: 0.0,                    // Wood is not metallic
                        clearcoat: 0.1,                    // Slight clearcoat for weathered wood
                        clearcoatRoughness: 0.8,           // Rough clearcoat
                        normalScale: new THREE.Vector2(0.5, 0.5)
                    });
                    
                    // Enable shadows
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            object.position.y = -2;
            object.scale.x = 4;
            object.scale.z = 4;
            scene.add(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error('An error occurred:', error);
        }
    );
}