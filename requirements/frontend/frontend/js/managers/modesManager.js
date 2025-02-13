import { globalManager } from "./globalManager.js"
import { modalService } from "../services/modalService.js"
import { reset } from "../utils/utils.js"
import { local } from "../mods/local.js"
import { remote } from "../mods/remote.js"
import{ multiplayer} from "../mods/multiplayer.js"

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
        let result = await local( this.gameSettings , ["player1", "player2"])
        await this.#denit( `${result} won`)
    }
    async tournament( ){
        await modalService.show(  '', false,'tournament' ) // the alias names for the players 
        const players = await globalManager._formService.handleTournament()
        await this.#init( )
        const winners = []
        winners[0] = await local(  this.gameSettings, [players[0], players[1]]  )
        await modalService.show(  `This round winner is ${winners[0]}` , true)
        winners[1] = await local(  this.gameSettings , [players[2], players[3]] )
        await modalService.show(  `This round winner is ${winners[1]}` , true)
        const winner = await local(  this.gameSettings , winners )
        await modalService.show(  `Winner is ${winner}` , true)
        await this.#denit( )
    }
    async remote( ){
        await globalManager._router.navigateTo( '/game' )
        let result = await remote( )
        console.log("SALINAAA")
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