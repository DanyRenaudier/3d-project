import * as THREE from 'three'
import { ARButton } from 'three/addons/webxr/ARButton.js';

class XrConfig {
    constructor() {
        if ('xr' in window.navigator) {
            this.addButton();
            this.xrSessionCheck();
        }
        
    }
    //methods
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