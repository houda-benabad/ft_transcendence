import { MODE, WORLD } from "../constants/engine.js"
import Remote from "../managers/remoteManager.js"

export function multiplayer(  ) {
    let multiplayer = new Remote( MODE.MULTIPLAYER )
    multiplayer.setup(  )
    console.log( "Multilayer staring soon" )
    return new Promise( resolve => multiplayer.animate( resolve ))
}
