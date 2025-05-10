import * as THREE from 'three/webgpu';

export function createPorch(scene) {
    // Create a group to hold all porch elements
    const porchGroup = new THREE.Group();
    
    // Board material with wood-like appearance
    const boardMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8B4513,  // Brown color
        roughness: 0.9,   // Rough surface like weathered wood
        metalness: 0.1,   // Low metalness for wood
        flatShading: true // Gives it a more rustic look
    });
    
    // Dimensions for the porch
    const porchWidth = 50;    // Total width of the porch
    const porchLength = 80;   // How far the porch extends into the water
    const boardWidth = 10;    // Width of each board
    const boardHeight = 3;    // Thickness of the boards
    const boardSpacing = 1;   // Gap between boards
    const boardCount = Math.floor(porchWidth / (boardWidth + boardSpacing));
    
    // Create the main porch platform
    for (let i = 0; i < boardCount; i++) {
        const boardGeom = new THREE.BoxGeometry(boardWidth, boardHeight, porchLength);
        const board = new THREE.Mesh(boardGeom, boardMaterial);
        
        // Position the boards side by side with small gaps
        const xPosition = (i * (boardWidth + boardSpacing)) - (porchWidth / 2) + (boardWidth / 2);
        board.position.set(xPosition, 0, porchLength / 2);
        
        // Add some random rotation to make it look more natural
        board.rotation.y = Math.random() * 0.02 - 0.01;
        board.rotation.x = Math.random() * 0.02 - 0.01;
        
        porchGroup.add(board);
    }
    
    // Create support pillars
    const pillarGeometry = new THREE.CylinderGeometry(3, 3, 30, 8);
    const pillarMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x5D4037,
        roughness: 0.7,
        metalness: 0.1
    });
    
    // Add four support pillars
    const pillarPositions = [
        { x: -porchWidth/2 + 5, z: 0 },
        { x: porchWidth/2 - 5, z: 0 },
        { x: -porchWidth/2 + 5, z: porchLength - 10 },
        { x: porchWidth/2 - 5, z: porchLength - 10 }
    ];
    
    pillarPositions.forEach(pos => {
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.position.set(pos.x, -15, pos.z);
        porchGroup.add(pillar);
    });
    
    // Add simple railings on the sides
    const railingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8B4513,
        roughness: 0.9,
        metalness: 0.1
    });
    
    // Horizontal railings
    const horizontalRailingGeom = new THREE.BoxGeometry(porchWidth, 2, 2);
    const leftRailing = new THREE.Mesh(horizontalRailingGeom, railingMaterial);
    leftRailing.position.set(0, 10, 0);
    porchGroup.add(leftRailing);
    
    const rightRailing = new THREE.Mesh(horizontalRailingGeom, railingMaterial);
    rightRailing.position.set(0, 10, porchLength);
    porchGroup.add(rightRailing);
    
    // Side railings
    const sideRailingGeom = new THREE.BoxGeometry(2, 2, porchLength);
    const sideRailing1 = new THREE.Mesh(sideRailingGeom, railingMaterial);
    sideRailing1.position.set(-porchWidth/2, 10, porchLength/2);
    porchGroup.add(sideRailing1);
    
    const sideRailing2 = new THREE.Mesh(sideRailingGeom, railingMaterial);
    sideRailing2.position.set(porchWidth/2, 10, porchLength/2);
    porchGroup.add(sideRailing2);
    
    // Vertical posts for the railings
    const postGeom = new THREE.BoxGeometry(2, 20, 2);
    
    // Add posts at corners and intervals
    const postSpacing = 20;
    const postCountLength = Math.floor(porchLength / postSpacing) + 1;
    
    for (let i = 0; i < postCountLength; i++) {
        const zPos = i * postSpacing;
        
        // Left side posts
        const leftPost = new THREE.Mesh(postGeom, railingMaterial);
        leftPost.position.set(-porchWidth/2, 5, zPos);
        porchGroup.add(leftPost);
        
        // Right side posts
        const rightPost = new THREE.Mesh(postGeom, railingMaterial);
        rightPost.position.set(porchWidth/2, 5, zPos);
        porchGroup.add(rightPost);
    }
    
    // Add porch to scene and return it
    scene.add(porchGroup);
    return porchGroup;
}

// Optional enhancements:
// - Add wood texture using TextureLoader
// - Add water surface beneath the porch
// - Add ambient sounds for a complete fishing experience
// - Add procedural wear/damage to make the porch look weathered