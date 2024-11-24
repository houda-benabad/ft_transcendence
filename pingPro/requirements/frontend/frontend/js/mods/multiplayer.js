import { MODE, WORLD } from "../constants/engine.js"
import Remote from "../utils/managers/remoteManager.js"

export function multiplayer(  ) {
    const app = document.getElementById( 'app' )
	app.className = 'game'
	app.innerHTML = ''


    let multiplayer = new Remote( MODE.MULTIPLAYER )
    multiplayer.setup(  )
    multiplayer.animate(  )
}
