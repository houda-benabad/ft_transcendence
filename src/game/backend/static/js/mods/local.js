import { MODE} from "../constants/engine.js"
import { TEXTURE } from "../constants/components.js"
import Local from "../utils/managers/localManagers.js"


export async function local(options) {
    let local = new Local( options )
    local.setup( )
	return new Promise ( ( resolve )=>{
		local.animate( resolve )
	})
	
}
