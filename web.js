import { Displayer } from "./models/Scene";

const url = './resources/bedroom.glb'
const displayer = new Displayer(url);
displayer.gltfLoader();

export {
    displayer
}