import { MODE} from "../constants/engine.js"
import { TEXTURE } from "../constants/components.js"
import Local from "../managers/localManagers.js"


export async function local( options , players) {
    let local = new Local( options, players )
    local.setup( )
	return new Promise ( ( resolve )=>{
		local.animate( resolve )
	})
	
}
