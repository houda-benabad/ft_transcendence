import Remote from "../utils/managers/remoteManager.js"
import { MODE, WORLD } from "../constants/engine.js"

export function remote(  ) {
    const app = document.getElementById( 'app' )
	app.className = 'game'
	app.innerHTML = ''


    let remote = new Remote(  MODE.REMOTE  )
    remote.setup(  )
    return new Promise( resolve => remote.animate( resolve ))
    
}
