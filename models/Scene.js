import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Displayer {

    constructor(url, fov = 45, aspect = window.innerWidth / window.innerHeight, near, far) {

        // HTML setup
        this.canvasCreator();

        // gltfModel setup
        this.url = url;

        // Camera setup
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.camera.position.z = 15;
        this.camera.position.x = 15;
        this.camera.position.y = 8;

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#512c10');

        // Renderer setup
        const canvas = document.getElementById('c');
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // orbitControls setup
        this.controls = this.orbitControls();

        this.lights();

        // Adding gltfModel
        this.gltfLoader();

        this.animate(canvas);

    }

    canvasCreator() {
        let canvas = document.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            document.body.append(canvas);
        }
        canvas.id = 'c';
    }

    lights() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.ambientLight.castShadow = true;
        this.scene.add(this.ambientLight);

        // directional light - parallel sun rays
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 6);

        this.directionalLight.castShadow = true;

        this.directionalLight.position.set(0, 32, 50);
        this.scene.add(this.directionalLight);
    }

    orbitControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        return controls
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    animate(canvas) {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.controls.update();
        this.resizeRendererToDisplaySize(canvas);
    }

    gltfLoader() {
        const loader = new GLTFLoader();
        loader.load(this.url, (gltf) => {
            const root = gltf.scene;
            this.scene.add(root);
        })
    }

    resizeRendererToDisplaySize(canvas) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            canvas.style.width =  `${width}px`;
            canvas.style.height = `${height}px`;
            this.renderer.setSize(width, height, false);
        }
    }
}

export { Displayer };