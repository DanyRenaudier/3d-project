import {XrConfig} from './utils/ArConfig'
import { displayer } from './web';

const xrSession = new XrConfig();

const main=async()=>{
    const result = await displayer.gltfLoader()
}

main()