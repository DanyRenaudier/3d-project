import * as THREE from 'three'
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

class XrConfig {
    constructor(url) {
        this.ArSession(url);
    }

    ArSession(url) {
        this.url = url
        this.loader = new GLTFLoader();
        this.hitTestSource = null;
        this.hitTestSourceRequested = false;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

        this.light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
        this.light.position.set(0.5, 1, 0.25);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.animate.bind(this));
        this.renderer.xr.enabled = true;

        this.geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);

        this.controller = this.renderer.xr.getController(0);

        this.reticle = new THREE.Mesh(
            new THREE.RingGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2),
            new THREE.MeshBasicMaterial()
        );
        this.controller.addEventListener('select', this.onSelect.bind(this));
        this.reticle.matrixAutoUpdate = false;
        this.reticle.visible = false;

        this.sceneAdd([this.light, this.camera, this.controller, this.reticle]);

        this.addButton();
        this.xrSessionCheck();
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    sceneAdd(add) {
        add.map(x => this.scene.add(x));
    }

    addButton() {
        let button = ARButton.createButton(this.renderer, { requiredFeatures: ['hit-test'] })
        document.body.appendChild(button);
    }

    async xrSessionCheck() {
        if (!('xr' in window.navigator)) {
            return false
        } else {
            let button = document.getElementById('ARButton')
            await navigator.xr.isSessionSupported('immersive-ar') ? button.innerHTML = 'Augmented Reality' : button.innerHTML = "AR NOT Supported"
        }
    }

    onSelect() {

        if (this.reticle.visible) {
            try {
                this.loader.setDRACOLoader(this.dLoader(this));
                this.loader.load(this.url, (gltf) => {
                    const root = gltf.scene;
                    this.scene.add(root);
                })
            } catch (error) {
                console.error(error)
            }

        }

    }

    dLoader() {
        const loader = new DRACOLoader();
        loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
        loader.setDecoderConfig({ type: 'js' })
        return loader;
    }

    animate(timestamp, frame) {

        if (frame) {

            const referenceSpace = this.renderer.xr.getReferenceSpace();
            const session = this.renderer.xr.getSession();
            if (this.hitTestSourceRequested === false) {
                session.requestReferenceSpace('viewer').then(referenceSpace => {

                    session.requestHitTestSource({ space: referenceSpace }).then(source => {
                        this.hitTestSource = source;

                    });

                });

                session.addEventListener('end', () => {
                    this.hitTestSourceRequested = false;
                    this.hitTestSource = null;
                    this.scene.clear()
                    this.sceneAdd([this.light, this.camera, this.controller, this.reticle]);
                });

                this.hitTestSourceRequested = true;

            }

            if (this.hitTestSource) {

                const hitTestResults = frame.getHitTestResults(this.hitTestSource);

                if (hitTestResults.length) {

                    const hit = hitTestResults[0];

                    this.reticle.visible = true;
                    this.reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);

                } else {

                    this.reticle.visible = false;

                }

            }

        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

}

export {
    XrConfig
}
