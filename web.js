import { Displayer } from "./models/Scene";

const url = './resources/scene.glb'
const displayer = new Displayer(url);
displayer.gltfLoader();

export {
    displayer
}