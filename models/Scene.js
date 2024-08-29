import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


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
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ canvas });

        // orbitControls setup
        this.controls = this.orbitControls();

        this.lights();

        this.animate();
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
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 15);

        this.directionalLight.castShadow = true;

        this.directionalLight.position.set(0, 32, 20);
        this.scene.add(this.directionalLight);
    }

    orbitControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        return controls
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    async animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.controls.update();
        this.resizeRendererToDisplaySize();
        let button = document.getElementById('ARButton')
            await navigator.xr.isSessionSupported('immersive-ar') ? button.innerHTML = 'Augmented Reality' : button.innerHTML = "AR NOT Supported"
    }

    gltfLoader() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            try {
                loader.setDRACOLoader(this.dLoader());
                loader.load(this.url, (gltf) => {
                    const root = gltf.scene;
                    this.scene.add(root);
                    this.awaitModel();
                    resolve('Modelo Cargado')
                })
            } catch (error) {
                reject(error);
            }
        })
    }

    resizeRendererToDisplaySize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const needResize = this.canvas.width !== width || this.canvas.height !== height;
        if (needResize) {
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
            this.renderer.setSize(width, height, false);
        }
    }

    dLoader() {
        const loader = new DRACOLoader();
        loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
        loader.setDecoderConfig({ type: 'js' })
        return loader;
    }

    awaitModel() {
        let load = document.querySelector('.loader-page');
        load.style.visibility = "hidden";
        load.style.opacity = '0';
        window.modelLoaded = true
    }


}

export { Displayer };