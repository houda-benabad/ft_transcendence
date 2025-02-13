import { globalManager } from "./globalManager.js"
import { modalService } from "../services/modalService.js"
import { reset } from "../utils/utils.js"
import { local } from "../mods/local.js"
import { remote } from "../mods/remote.js"
import{ multiplayer} from "../mods/multiplayer.js"
import { tournament } from "../mods/tournament.js"
export class GameManager 

{
    constructor()
    {
        this.gameSettings = null
        this.app = document.getElementById( 'app' )
    }

    async #init( ){
        await globalManager._router.navigateTo( '/game-settings' )
        this.gameSettings = await globalManager._formService.handleGame(  )
        await globalManager._router.navigateTo( '/game' )
        await modalService.show("🎮 Controls:<br>🟦 Player 1: W / S<br>🟥 Player 2: ⬆ / ⬇", false);

    }

    async #denit( message='Game over', automatisation=true ){
        console.log("BYE BYE")
        await modalService.show(  message , automatisation)
        await reset(  )
        globalManager._router.navigateTo( '/' )
        
    }
    async local()
    {
        await this.#init()
        let result = await local( this.gameSettings , ["player", "player"])
        if(result )
            await this.#denit( `You ${result.state}`, false )
        else{
            await this.#denit(  )
        }
    }
    async tournament( ){
        await modalService.show(  '', false,'tournament' )
        const players = await globalManager._formService.handleTournament()
        await this.#init( )
        await tournament(this.gameSettings, players  )
        await this.#denit( )
    }
    async remote( ){
        await globalManager._router.navigateTo( '/game' )
        let result = await remote( )
        if(result )
            await this.#denit( `You ${result.state}`, false )
        else{
            await this.#denit(  )
        }
    }
    async multiplayer( ){
        await globalManager._router.navigateTo( '/game' )
        let result = await multiplayer( )
        if(result )
            await this.#denit( `You ${result.state}`, false )
        else
            await this.#denit(  )
    }
}