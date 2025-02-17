import { globalManager, setisAllOptionsForGameSettings, getIsItOutOfGame} from "./globalManager.js"
import { modalService } from "../services/modalService.js"
import { reset } from "../utils/utils.js"
import { local } from "../mods/local.js"
import { remote } from "../mods/remote.js"
import{ multiplayer} from "../mods/multiplayer.js"
import { tournament } from "../mods/tournament.js"
import { MODE } from "../constants/engine.js"
export class GameManager 

{
    constructor()
    {
        this.gameSettings = null
        this.app = document.getElementById( 'app' )
    }

    async #init( mode ){
        await globalManager._router.navigateTo( '/game-settings', true)
        this.gameSettings = await globalManager._formService.handleGame(  )
        await globalManager._router.navigateTo( '/game', true)
        if (mode == MODE.LOCAL || mode == MODE.TOURNAMENT)
            await modalService.show("🎮 Controls:<br>🟦 Left side keys : W / S<br>🟥 Right side keys: ⬆ / ⬇", false);
        else
            await modalService.show("🎮 Controls:<br>🟦  keys: ⬆ / ⬇", false);

    }

    async #denit( message='Game over', automatisation=true ){
        await modalService.show(  message , automatisation)
        if (getIsItOutOfGame() === false)
        {
            await reset(  )
            globalManager._router.navigateTo( '/' )
        }
        
    }
    async local()
    {
        setisAllOptionsForGameSettings(true)
        await this.#init()
        let result = await local( this.gameSettings , ["player2", "player1"])
        await this.#denit(  )
    }
    async tournament( ){
        await modalService.show(  '', false,'tournament' )
        const players = await globalManager._formService.handleTournament()
        setisAllOptionsForGameSettings(true)
        await this.#init( )
        await tournament(this.gameSettings, players  )
        await this.#denit( )
    }
    async remote( ){
        setisAllOptionsForGameSettings(false)
        await this.#init( )
        let result = await remote( this.gameSettings )
        if(result )
            await this.#denit( `You ${result.state}`, false )
        else{
            await this.#denit(  )
        }
    }
    async multiplayer( ){
        setisAllOptionsForGameSettings(false)
        await this.#init()
        let result = await multiplayer( )
        if(result )
            await this.#denit( `You ${result.state}`, false )
        else
            await this.#denit(  )
    }
}