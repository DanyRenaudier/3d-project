import * as THREE from 'three'
import { ARButton } from 'three/addons/webxr/ARButton.js';

class XrConfig {
    constructor() {
        this.ArSession()

    }

    ArSession() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.addButton();
        this.xrSessionCheck();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
        this.light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
        
        this.light.position.set(0.5, 1, 0.25);
        
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        
        this.sceneAdd([this.light, this.camera]);
    }

    sceneAdd(add){
        add.map(x=> this.scene.add(x));
    }

    addButton() {
        let button = ARButton.createButton(this.renderer, { requiredFeatures: ['hit-test'] })
        document.body.appendChild(button);
    }

    async xrSessionCheck() {
        let button = document.getElementById('ARButton')
        await navigator.xr.isSessionSupported('immersive-ar') ? button.innerHTML = 'Augmented Reality' : button.innerHTML = "AR NOT Supported"
    }
}

export { XrConfig }
