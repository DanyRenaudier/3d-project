import { Displayer } from "./models/Scene";

const url = './resources/web-bedroom.glb'
const displayer = new Displayer(url);
displayer.gltfLoader();

export {
    displayer
}