import { MODE, WORLD } from "../constants/engine.js"
import Remote from "../managers/remoteManager.js"

export function multiplayer(  ) {
    let multiplayer = new Remote( MODE.MULTIPLAYER )
    return new Promise( (resolve) =>{ 
        multiplayer.setup( resolve )
        multiplayer.animate(  )
    } )
}
