import { MODE, WORLD } from "../constants/engine.js"
import Remote from "../utils/managers/remoteManager.js"

export function multiplayer(  ) {


    let multiplayer = new Remote( MODE.MULTIPLAYER )
    multiplayer.setup(  )
    return new Promise( resolve => multiplayer.animate( resolve ))
    
}
