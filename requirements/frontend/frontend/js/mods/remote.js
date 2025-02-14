import Remote from "../managers/remoteManager.js"
import { MODE, WORLD } from "../constants/engine.js"

export async function remote( options ) {
    let remote = new Remote( MODE.REMOTE, options )
    return new Promise ( ( resolve )=>{
        remote.setup( resolve )
        remote.animate( resolve )
    })
    
}
