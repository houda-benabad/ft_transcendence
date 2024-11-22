import { MODE} from "../constants/engine.js"
import { TEXTURE } from "../constants/components.js"
import Local from "../utils/managers/localManagers.js"


export async function local() {
	//  WILL BE REMOVED IN FRONT MERGE
    const app = document.getElementById( 'app' )
	app.className = 'game'
	app.innerHTML = ''

    let options ={
        mode : 'time',
        range : 2,
		texture : TEXTURE,
		background : TEXTURE
    } 

    let local = new Local( options )
    local.setup( )
	return new Promise ( ( resolve )=>{
		local.animate( resolve )
	})
	
}
